package com.citypilot.parking.services;

import com.citypilot.parking.repositories.ParkingRepository;

import java.time.Instant;
import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class BookingService {
    private final ParkingRepository parkingRepository;
    private final PricingService pricingService;

    public BookingService(ParkingRepository parkingRepository, PricingService pricingService) {
        this.parkingRepository = parkingRepository;
        this.pricingService = pricingService;
    }

    public Map<String, Object> createBooking(Map<String, Object> input) {
        Object spotId = input.get("spotId");
        if (spotId == null) throw new IllegalArgumentException("spotId is required");
        Map<String, Object> spot = parkingRepository.findSpotById(spotId);
        if (spot == null) throw new IllegalArgumentException("spot not found");

        String durSel = stringOrDefault(input.get("durSel"), "4小时");
        Map<String, Object> booking = object(
                "id", "CP" + System.currentTimeMillis(),
                "spotId", spot.get("id"),
                "spotName", spot.get("name"),
                "code", spot.get("code"),
                "mode", stringOrDefault(input.get("mode"), "now"),
                "dateSel", stringOrDefault(input.get("dateSel"), "现在"),
                "durSel", durSel,
                "amount", pricingService.calculateOrderAmount(spot, durSel),
                "status", "paid",
                "createdAt", Instant.now().toString()
        );
        return parkingRepository.createBooking(booking);
    }

    private String stringOrDefault(Object value, String fallback) {
        if (value == null || String.valueOf(value).trim().isEmpty()) return fallback;
        return String.valueOf(value);
    }
}
