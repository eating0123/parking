package com.citypilot.parking.services;

import com.citypilot.parking.repositories.ParkingRepository;
import com.citypilot.parking.utils.JsonUtil;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class CommunityService {
    private final ParkingRepository parkingRepository;

    public CommunityService(ParkingRepository parkingRepository) {
        this.parkingRepository = parkingRepository;
    }

    public Map<String, Object> listDistricts() {
        return object("districts", enrichedDistricts());
    }

    public Map<String, Object> listDistrictSpots(String rawQuery) {
        String key = queryParam(rawQuery, "district");
        if (key.isEmpty()) key = queryParam(rawQuery, "key");
        Map<String, Object> district = enrichedDistrict(parkingRepository.findCommunityDistrict(key));
        return object(
                "district", district,
                "spots", districtSpots(district),
                "spotCount", district.get("spotCount"),
                "availableCount", district.get("availableCount")
        );
    }

    public Map<String, Object> locate(Map<String, Object> input) {
        Map<String, Object> district = districtFromInput(input);
        List<Map<String, Object>> spots = districtSpots(district);
        return object(
                "stage", "matched",
                "district", district,
                "districts", enrichedDistricts(),
                "spots", spots,
                "spotCount", district.get("spotCount"),
                "availableCount", district.get("availableCount"),
                "summary", "已匹配 " + district.get("name") + "，片区内可停车位 " + district.get("spotCount") + " 个"
        );
    }

    public Map<String, Object> locate(String rawQuery) {
        return locate(queryParams(rawQuery));
    }

    private Map<String, Object> districtFromInput(Map<String, Object> input) {
        Object explicit = firstPresent(input, "district", "key", "districtKey");
        if (explicit != null && !String.valueOf(explicit).trim().isEmpty()) {
            return enrichedDistrict(parkingRepository.findCommunityDistrict(String.valueOf(explicit)));
        }

        Double lng = number(input.get("lng"));
        Double lat = number(input.get("lat"));
        if (lng == null || lat == null) {
            Object location = input.get("location");
            if (location instanceof Map) {
                Map<String, Object> locationMap = JsonUtil.castMap(location);
                lng = number(locationMap.get("lng"));
                lat = number(locationMap.get("lat"));
            }
        }
        if (lng == null || lat == null) {
            return enrichedDistrict(parkingRepository.findCommunityDistrict("zaoyuan"));
        }

        Map<String, Object> best = null;
        double bestDistance = Double.MAX_VALUE;
        for (Map<String, Object> district : parkingRepository.listCommunityDistricts()) {
            Map<String, Object> enriched = enrichedDistrict(district);
            double distance = distanceMeters(lng, lat, num(enriched.get("centerLng")), num(enriched.get("centerLat")));
            if (distance < bestDistance) {
                bestDistance = distance;
                best = enriched;
            }
        }
        if (best == null) best = enrichedDistrict(parkingRepository.findCommunityDistrict("zaoyuan"));
        best.put("matchDistance", Math.round(bestDistance));
        return best;
    }

    private List<Map<String, Object>> enrichedDistricts() {
        List<Map<String, Object>> districts = new ArrayList<>();
        for (Map<String, Object> district : parkingRepository.listCommunityDistricts()) {
            districts.add(enrichedDistrict(district));
        }
        return districts;
    }

    private Map<String, Object> enrichedDistrict(Map<String, Object> source) {
        Map<String, Object> district = new LinkedHashMap<>(source);
        List<Map<String, Object>> spots = districtSpots(district);
        int available = 0;
        int free = 0;
        double lng = 0;
        double lat = 0;
        for (Map<String, Object> spot : spots) {
            available += intVal(spot.get("count"));
            if (doubleVal(spot.get("rate")) == 0) free += intVal(spot.get("count"));
            lng += num(spot.get("lng"));
            lat += num(spot.get("lat"));
        }
        int divisor = Math.max(1, spots.size());
        district.put("spotCount", spots.size());
        district.put("availableCount", available);
        district.put("freeCount", free);
        district.put("centerLng", lng / divisor);
        district.put("centerLat", lat / divisor);
        return district;
    }

    private List<Map<String, Object>> districtSpots(Map<String, Object> district) {
        Object ids = district.get("spots");
        if (!(ids instanceof List)) return new ArrayList<>();
        return parkingRepository.listSpotsByIds((List<?>) ids);
    }

    private Object firstPresent(Map<String, Object> input, String... keys) {
        for (String key : keys) {
            if (input.containsKey(key)) return input.get(key);
        }
        return null;
    }

    private String queryParam(String rawQuery, String key) {
        return String.valueOf(queryParams(rawQuery).getOrDefault(key, ""));
    }

    private Map<String, Object> queryParams(String rawQuery) {
        Map<String, Object> params = new LinkedHashMap<>();
        if (rawQuery == null || rawQuery.isEmpty()) return params;
        for (String part : rawQuery.split("&")) {
            String[] pair = part.split("=", 2);
            if (pair.length == 2) {
                params.put(pair[0], java.net.URLDecoder.decode(pair[1], java.nio.charset.StandardCharsets.UTF_8).trim());
            }
        }
        return params;
    }

    private Double number(Object value) {
        if (value == null) return null;
        if (value instanceof Number) return ((Number) value).doubleValue();
        try {
            return Double.parseDouble(String.valueOf(value));
        } catch (NumberFormatException error) {
            return null;
        }
    }

    private double num(Object value) {
        return ((Number) value).doubleValue();
    }

    private int intVal(Object value) {
        return ((Number) value).intValue();
    }

    private double doubleVal(Object value) {
        return ((Number) value).doubleValue();
    }

    private double distanceMeters(double lng1, double lat1, double lng2, double lat2) {
        double earth = 6371000;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLng = Math.toRadians(lng2 - lng1);
        double a = Math.pow(Math.sin(dLat / 2), 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2)) * Math.pow(Math.sin(dLng / 2), 2);
        return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }
}
