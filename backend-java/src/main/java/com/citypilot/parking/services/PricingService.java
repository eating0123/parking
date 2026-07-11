package com.citypilot.parking.services;

import java.util.Map;

public class PricingService {
    public int hoursForDuration(String duration) {
        if ("2小时".equals(duration)) return 2;
        if ("至明早8点".equals(duration)) return 10;
        return 4;
    }

    public double calculateParkingFee(Map<String, Object> spot, String duration) {
        double rate = ((Number) spot.get("rate")).doubleValue();
        int cap = ((Number) spot.get("cap")).intValue();
        double parking = rate * hoursForDuration(duration);
        return cap > 0 ? Math.min(parking, cap) : parking;
    }

    public double calculateOrderAmount(Map<String, Object> spot, String duration) {
        return round1(calculateParkingFee(spot, duration) + 0.5);
    }

    private double round1(double value) {
        return Math.round(value * 10.0) / 10.0;
    }
}
