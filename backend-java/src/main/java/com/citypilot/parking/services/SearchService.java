package com.citypilot.parking.services;

import com.citypilot.parking.repositories.ParkingRepository;
import com.citypilot.parking.utils.JsonUtil;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class SearchService {
    private final ParkingRepository parkingRepository;
    private final HttpClient httpClient = HttpClient.newHttpClient();

    public SearchService(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    public Map<String, Object> search(String rawQuery) throws IOException, InterruptedException {
        String query = queryParam(rawQuery, "q");
        if (query.isEmpty()) query = queryParam(rawQuery, "keyword");
        List<Map<String, Object>> spots = parkingRepository.listSpots();
        if (query.isEmpty()) return object("query", query, "pois", new ArrayList<>(), "spots", spots, "source", "empty");

        List<Map<String, Object>> localMatches = searchLocalSpots(spots, query);
        String key = firstEnv("AMAP_WEB_SERVICE_KEY", "AMAP_REST_KEY", "AMAP_KEY");
        if (key.isEmpty()) key = "2d9d7b965d4ad734cad91114f500eeaa";
        if (key.isEmpty()) {
            return object(
                    "query", query,
                    "pois", new ArrayList<>(),
                    "spots", localMatches,
                    "source", "local",
                    "warning", "AMAP_WEB_SERVICE_KEY is not configured"
            );
        }

        String city = queryParam(rawQuery, "city");
        if (city.isEmpty()) city = "北京";
        URI uri = URI.create("https://restapi.amap.com/v3/place/text"
                + "?key=" + enc(key)
                + "&keywords=" + enc(query)
                + "&city=" + enc(city)
                + "&citylimit=false&offset=20&page=1&extensions=base");
        HttpRequest request = HttpRequest.newBuilder(uri).header("Accept", "application/json").GET().build();
        HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        if (response.statusCode() < 200 || response.statusCode() >= 300) {
            throw new IOException("AMap search request failed: " + response.statusCode());
        }

        Map<String, Object> payload = JsonUtil.parseObject(response.body());
        if (!"1".equals(String.valueOf(payload.get("status")))) {
            throw new IOException("AMap search failed: " + payload.get("info"));
        }

        List<Map<String, Object>> pois = normalizePois(payload.get("pois"));
        return object(
                "query", query,
                "pois", pois,
                "spots", rankSpotsByPois(spots, pois, localMatches),
                "source", "amap"
        );
    }

    private List<Map<String, Object>> normalizePois(Object value) {
        List<Map<String, Object>> pois = new ArrayList<>();
        if (!(value instanceof Iterable)) return pois;
        for (Object item : (Iterable<?>) value) {
            if (!(item instanceof Map)) continue;
            Map<String, Object> poi = JsonUtil.castMap(item);
            String[] loc = String.valueOf(poi.getOrDefault("location", "")).split(",");
            if (loc.length != 2) continue;
            try {
                double lng = Double.parseDouble(loc[0]);
                double lat = Double.parseDouble(loc[1]);
                pois.add(object(
                        "id", poi.get("id"),
                        "name", poi.get("name"),
                        "address", String.valueOf(poi.getOrDefault("address", "")),
                        "type", poi.get("type"),
                        "district", poi.get("adname"),
                        "lng", lng,
                        "lat", lat
                ));
            } catch (NumberFormatException ignored) {
            }
        }
        return pois;
    }

    private List<Map<String, Object>> searchLocalSpots(List<Map<String, Object>> spots, String query) {
        String q = normalize(query);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Map<String, Object> spot : spots) {
            String text = normalize(String.join(" ",
                    str(spot.get("name")),
                    str(spot.get("addr")),
                    str(spot.get("badge")),
                    str(spot.get("rule")),
                    str(spot.get("window")),
                    Boolean.TRUE.equals(spot.get("ev")) ? "充电 新能源 电车 ev" : "",
                    Boolean.TRUE.equals(spot.get("noSlope")) ? "无坡道 老人 电梯" : "",
                    Boolean.TRUE.equals(spot.get("covered")) ? "室内 地下 遮雨" : "",
                    Number.class.isInstance(spot.get("rate")) && ((Number) spot.get("rate")).doubleValue() == 0 ? "免费 0元 不收费" : "",
                    Number.class.isInstance(spot.get("monthly")) && ((Number) spot.get("monthly")).doubleValue() > 0 ? "月卡 包月" : "",
                    sizeLabel(str(spot.get("size")))
            ));
            if (text.contains(q)) result.add(spot);
        }
        return result;
    }

    private List<Map<String, Object>> rankSpotsByPois(List<Map<String, Object>> spots, List<Map<String, Object>> pois, List<Map<String, Object>> localMatches) {
        if (pois.isEmpty()) return localMatches;
        Map<Object, Map<String, Object>> byId = new LinkedHashMap<>();
        for (Map<String, Object> spot : localMatches) byId.put(spot.get("id"), spot);

        List<Map<String, Object>> ranked = new ArrayList<>();
        for (Map<String, Object> spot : spots) {
            double nearest = Double.MAX_VALUE;
            for (Map<String, Object> poi : pois) {
                nearest = Math.min(nearest, distanceMeters(num(spot.get("lng")), num(spot.get("lat")), num(poi.get("lng")), num(poi.get("lat"))));
            }
            if (nearest <= 5000) {
                Map<String, Object> copy = new LinkedHashMap<>(spot);
                copy.put("searchDistance", Math.round(nearest));
                ranked.add(copy);
            }
        }
        ranked.sort(Comparator.comparingDouble(spot -> ((Number) spot.get("searchDistance")).doubleValue()));
        for (Map<String, Object> spot : ranked) byId.put(spot.get("id"), spot);
        return new ArrayList<>(byId.values());
    }

    private double distanceMeters(double lng1, double lat1, double lng2, double lat2) {
        double earth = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.pow(Math.sin(dLng / 2), 2);
        return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    private String queryParam(String rawQuery, String key) {
        if (rawQuery == null || rawQuery.isEmpty()) return "";
        for (String part : rawQuery.split("&")) {
            String[] pair = part.split("=", 2);
            if (pair.length == 2 && key.equals(pair[0])) {
                return java.net.URLDecoder.decode(pair[1], StandardCharsets.UTF_8).trim();
            }
        }
        return "";
    }

    private String firstEnv(String... keys) {
        for (String key : keys) {
            String value = System.getenv(key);
            if (value != null && !value.trim().isEmpty()) return value.trim();
        }
        return "";
    }

    private String enc(String value) {
        return URLEncoder.encode(value, StandardCharsets.UTF_8);
    }

    private String normalize(String value) {
        return value.toLowerCase().replaceAll("\\s+", "");
    }

    private String str(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private double num(Object value) {
        return value instanceof Number ? ((Number) value).doubleValue() : Double.parseDouble(String.valueOf(value));
    }

    private String sizeLabel(String size) {
        if ("large".equals(size)) return "大车位";
        if ("bus".equals(size)) return "大客车位";
        return "标准位";
    }
}
