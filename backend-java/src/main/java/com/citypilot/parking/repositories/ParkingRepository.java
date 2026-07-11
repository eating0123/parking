package com.citypilot.parking.repositories;

import java.util.List;
import java.util.Map;

public class ParkingRepository {
    public List<Map<String, Object>> listSpots() {
        return DataStore.SPOTS;
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
