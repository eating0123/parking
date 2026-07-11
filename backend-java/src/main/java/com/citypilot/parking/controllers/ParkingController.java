package com.citypilot.parking.controllers;

import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.http.RequestBodies;
import com.citypilot.parking.repositories.ParkingRepository;
import com.citypilot.parking.services.BookingService;
import com.citypilot.parking.services.RecommendationService;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class ParkingController {
    private final ParkingRepository parkingRepository;
    private final RecommendationService recommendationService;
    private final BookingService bookingService;

    public ParkingController(ParkingRepository parkingRepository, RecommendationService recommendationService, BookingService bookingService) {
        this.parkingRepository = parkingRepository;
        this.recommendationService = recommendationService;
        this.bookingService = bookingService;
    }

    public void listSpots(HttpExchange exchange) throws IOException {
        HttpResponses.json(exchange, 200, object("spots", parkingRepository.listSpots()));
    }

    public void listOrders(HttpExchange exchange) throws IOException {
        HttpResponses.json(exchange, 200, object(
                "orders", parkingRepository.listOrders(),
                "bookings", parkingRepository.listBookings()
        ));
    }

    public void recommend(HttpExchange exchange) throws IOException {
        Map<String, Object> body = RequestBodies.jsonObject(exchange);
        HttpResponses.json(exchange, 200, recommendationService.recommend(body));
    }

    public void createBooking(HttpExchange exchange) throws IOException {
        try {
            Map<String, Object> body = RequestBodies.jsonObject(exchange);
            HttpResponses.json(exchange, 201, object("booking", bookingService.createBooking(body)));
        } catch (IllegalArgumentException error) {
            HttpResponses.json(exchange, 400, HttpResponses.error(error.getMessage()));
        }
    }
}
