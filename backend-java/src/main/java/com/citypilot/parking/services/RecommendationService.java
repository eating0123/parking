package com.citypilot.parking.services;

import com.citypilot.parking.repositories.ParkingRepository;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static com.citypilot.parking.utils.JsonUtil.object;

public class RecommendationService {
    private final ParkingRepository parkingRepository;
    private final PricingService pricingService;

    public RecommendationService(ParkingRepository parkingRepository, PricingService pricingService) {
        this.parkingRepository = parkingRepository;
        this.pricingService = pricingService;
    }

    public Map<String, Object> recommend(Map<String, Object> input) {
        Need need = Need.parse(input);
        List<Map<String, Object>> spots = parkingRepository.listSpots();
        List<Map<String, Object>> candidates = filterCandidates(spots, need);
        Map<String, Object> best = candidates.stream()
                .max(Comparator.comparingDouble(spot -> score(spot, need)))
                .orElse(spots.get(0));
        int score = Math.min(99, (int) Math.round(score(best, need)));

        return object(
                "spotId", best.get("id"),
                "spot", best,
                "score", score,
                "mode", need.mode,
                "dateSel", need.dateSel,
                "durSel", need.durSel,
                "evOnly", need.wantsEv,
                "smartNoSlope", need.noSlope,
                "smartCovered", need.covered,
                "smartSize", need.smartSize,
                "estimatedFee", pricingService.calculateOrderAmount(best, need.durSel),
                "reply", buildReply(best, need)
        );
    }

    private List<Map<String, Object>> filterCandidates(List<Map<String, Object>> spots, Need need) {
        List<Map<String, Object>> result = spots.stream().filter(spot -> {
            if (need.wantsEv && !bool(spot.get("ev"))) return false;
            if (need.noSlope && !bool(spot.get("noSlope"))) return false;
            if (need.covered && !(bool(spot.get("covered")) || bool(spot.get("elevator")))) return false;
            if (need.monthly && intVal(spot.get("monthly")) <= 0) return false;
            String size = String.valueOf(spot.get("size"));
            if (!"any".equals(need.smartSize) && !size.equals(need.smartSize) && !("large".equals(need.smartSize) && "bus".equals(size))) return false;
            return true;
        }).collect(Collectors.toList());
        return result.isEmpty() ? spots : result;
    }

    private double score(Map<String, Object> spot, Need need) {
        double score = 80 - distanceMeters(spot) / 18.0;
        if (bool(spot.get("noSlope"))) score += 14;
        if (bool(spot.get("ev"))) score += need.wantsEv ? 26 : 8;
        if (bool(spot.get("covered"))) score += need.covered ? 20 : 6;
        if (bool(spot.get("elevator"))) score += need.noSlope ? 12 : 4;
        if ("bus".equals(spot.get("size"))) score += need.bus ? 28 : 8;
        if ("large".equals(spot.get("size"))) score += need.large ? 18 : 5;
        if (need.cheap) score += intVal(spot.get("rate")) == 0 ? 24 : Math.max(0, 12 - doubleVal(spot.get("rate")) * 3);
        if (need.near) score += Math.max(0, 20 - distanceMeters(spot) / 35.0);
        if (need.overnight && intVal(spot.get("cap")) > 0) score += 12;
        if (need.daytime && String.valueOf(spot.get("window")).startsWith("08")) score += 16;
        return score;
    }

    private String buildReply(Map<String, Object> spot, Need need) {
        StringBuilder reason = new StringBuilder();
        reason.append(spot.get("dist")).append("、步行").append(spot.get("walk"));
        if (bool(spot.get("ev"))) reason.append("，有充电桩");
        if (bool(spot.get("noSlope"))) reason.append("，无坡道");
        if (bool(spot.get("covered"))) reason.append("，室内车位");
        if (need.cheap) reason.append("，费用更低");
        return "建议选 " + spot.get("name") + "，" + reason + "。已按你的需求更新筛选，下一步可直接查看详情并锁定车位。";
    }

    private double distanceMeters(Map<String, Object> spot) {
        String dist = String.valueOf(spot.get("dist"));
        if (dist.contains("km")) return Double.parseDouble(dist.replace("km", "")) * 1000;
        return Double.parseDouble(dist.replace("m", ""));
    }

    private boolean bool(Object value) {
        return Boolean.TRUE.equals(value);
    }

    private int intVal(Object value) {
        return ((Number) value).intValue();
    }

    private double doubleVal(Object value) {
        return ((Number) value).doubleValue();
    }

    private static class Need {
        String text;
        boolean wantsEv;
        boolean noSlope;
        boolean covered;
        boolean bus;
        boolean large;
        boolean cheap;
        boolean near;
        boolean monthly;
        boolean overnight;
        boolean daytime;
        String smartSize;
        String mode;
        String dateSel;
        String durSel;

        static Need parse(Map<String, Object> input) {
            Need need = new Need();
            need.text = String.valueOf(input.getOrDefault("text", "")).toLowerCase();
            need.bus = matches(need.text, "大巴", "客车", "团队", "巴士");
            need.large = matches(need.text, "大车", "宽", "suv", "商务");
            need.cheap = matches(need.text, "便宜", "价格", "省钱", "免费", "低价");
            need.near = matches(need.text, "近", "步行", "少走", "地铁", "附近");
            need.monthly = matches(need.text, "月卡", "包月", "长期", "通勤");
            boolean future = matches(need.text, "今晚", "明天", "预约", "稍后", "晚上");
            need.overnight = matches(need.text, "明早", "过夜", "次日", "整晚");
            need.daytime = matches(need.text, "白天", "上午", "下午", "办事");
            need.wantsEv = matches(need.text, "充电", "电车", "新能源", "ev") || Boolean.TRUE.equals(input.get("evOnly"));
            need.noSlope = matches(need.text, "无坡", "不爬坡", "老人", "长辈", "轮椅", "电梯") || Boolean.TRUE.equals(input.get("smartNoSlope"));
            need.covered = matches(need.text, "室内", "地下", "下雨", "电梯") || Boolean.TRUE.equals(input.get("smartCovered"));
            need.smartSize = need.bus ? "bus" : need.large ? "large" : String.valueOf(input.getOrDefault("smartSize", "any"));
            need.mode = need.monthly ? "monthly" : future || need.overnight ? "future" : "now";
            need.dateSel = "now".equals(need.mode) ? "现在" : need.text.contains("21") ? "今晚 21:00" : need.text.contains("明天") ? "明天 19:00" : "今晚 19:00";
            need.durSel = need.overnight ? "至明早8点" : need.text.contains("2") || need.daytime ? "2小时" : String.valueOf(input.getOrDefault("durSel", "4小时"));
            return need;
        }

        private static boolean matches(String text, String... tokens) {
            for (String token : tokens) {
                if (text.contains(token)) return true;
            }
            return false;
        }
    }
}
