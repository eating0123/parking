package com.citypilot.parking.repositories;

import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.castMap;
import static com.citypilot.parking.utils.JsonUtil.object;

public class OwnerRepository {
    public synchronized Map<String, Object> getOwnerProfile() {
        return DataStore.OWNER;
    }

    public synchronized Map<String, Object> updateRentStatus(boolean renting) {
        DataStore.OWNER.put("renting", renting);
        castMap(DataStore.OWNER.get("spot")).put("status", renting ? "出租中" : "已暂停");
        return DataStore.OWNER;
    }

    public synchronized Map<String, Object> createOwnerSpot(Map<String, Object> input) {
        Map<String, Object> spot = object(
                "name", stringOrDefault(input.get("name"), "新增共享车位"),
                "window", stringOrDefault(input.get("window"), "工作日 08:30 - 18:00"),
                "price", stringOrDefault(input.get("price"), "¥4 / 时"),
                "status", "出租中"
        );
        DataStore.OWNER.put("spot", spot);
        DataStore.OWNER.put("renting", true);
        return spot;
    }

    private String stringOrDefault(Object value, String fallback) {
        if (value == null || String.valueOf(value).trim().isEmpty()) return fallback;
        return String.valueOf(value);
    }
}
