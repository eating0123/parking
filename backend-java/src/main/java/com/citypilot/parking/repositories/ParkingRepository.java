package com.citypilot.parking.repositories;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

public class ParkingRepository {
    public List<Map<String, Object>> listSpots() {
        return DataStore.SPOTS;
    }

    public List<Map<String, Object>> listCommunityDistricts() {
        return DataStore.COMMUNITY_DISTRICTS;
    }

    public Map<String, Object> findCommunityDistrict(String key) {
        String normalized = key == null || key.trim().isEmpty() ? "zaoyuan" : key.trim();
        return DataStore.COMMUNITY_DISTRICTS.stream()
                .filter(district -> normalized.equals(district.get("key")))
                .findFirst()
                .orElse(DataStore.COMMUNITY_DISTRICTS.get(0));
    }

    public List<Map<String, Object>> listSpotsByIds(List<?> ids) {
        List<Map<String, Object>> result = new ArrayList<>();
        for (Object id : ids) {
            Map<String, Object> spot = findSpotById(id);
            if (spot != null) result.add(spot);
        }
        return result;
    }

    public Map<String, Object> findSpotById(Object id) {
        int numericId = ((Number) toNumber(id)).intValue();
        return DataStore.SPOTS.stream()
                .filter(spot -> ((Number) spot.get("id")).intValue() == numericId)
                .findFirst()
                .orElse(null);
    }

    public List<Map<String, Object>> listOrders() {
        return DataStore.ORDERS;
    }

    public List<Map<String, Object>> listBookings() {
        return DataStore.BOOKINGS;
    }

    public Map<String, Object> createBooking(Map<String, Object> booking) {
        DataStore.BOOKINGS.add(0, booking);
        return booking;
    }

    private Number toNumber(Object value) {
        if (value instanceof Number) return (Number) value;
        return Integer.parseInt(String.valueOf(value));
    }
}
