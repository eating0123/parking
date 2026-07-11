package com.citypilot.parking.controllers;

import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.http.RequestBodies;
import com.citypilot.parking.repositories.ParkingRepository;
import com.citypilot.parking.services.BookingService;
import com.citypilot.parking.services.RecommendationService;
import com.citypilot.parking.services.SearchService;
import com.citypilot.parking.utils.BackendLog;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.List;
import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class ParkingController {
    private final ParkingRepository parkingRepository;
    private final RecommendationService recommendationService;
    private final BookingService bookingService;
    private final SearchService searchService;

    public ParkingController(ParkingRepository parkingRepository, RecommendationService recommendationService, BookingService bookingService, SearchService searchService) {
        this.parkingRepository = parkingRepository;
        this.recommendationService = recommendationService;
        this.bookingService = bookingService;
        this.searchService = searchService;
    }

    public void listSpots(HttpExchange exchange) throws IOException {
        List<Map<String, Object>> spots = parkingRepository.listSpots();
        BackendLog.beforeReturn(exchange, "listSpots", "spots=" + spots.size());
        HttpResponses.json(exchange, 200, object("spots", spots));
    }

    public void searchSpots(HttpExchange exchange) throws IOException {
        try {
            Map<String, Object> result = searchService.search(exchange.getRequestURI().getRawQuery());
            BackendLog.beforeReturn(exchange, "searchSpots", "source=" + result.get("source"));
            HttpResponses.json(exchange, 200, result);
        } catch (InterruptedException error) {
            Thread.currentThread().interrupt();
            HttpResponses.json(exchange, 500, HttpResponses.error("search interrupted"));
        }
    }

    public void listOrders(HttpExchange exchange) throws IOException {
        List<Map<String, Object>> orders = parkingRepository.listOrders();
        List<Map<String, Object>> bookings = parkingRepository.listBookings();
        BackendLog.beforeReturn(exchange, "listOrders", "orders=" + orders.size() + " bookings=" + bookings.size());
        HttpResponses.json(exchange, 200, object(
                "orders", orders,
                "bookings", bookings
        ));
    }

    public void recommend(HttpExchange exchange) throws IOException {
        Map<String, Object> body = RequestBodies.jsonObject(exchange);
        Map<String, Object> result = recommendationService.recommend(body);
        BackendLog.beforeReturn(exchange, "recommend", "spotId=" + result.get("spotId") + " score=" + result.get("score"));
        HttpResponses.json(exchange, 200, result);
    }

    public void createBooking(HttpExchange exchange) throws IOException {
        try {
            Map<String, Object> body = RequestBodies.jsonObject(exchange);
            Map<String, Object> booking = bookingService.createBooking(body);
            BackendLog.beforeReturn(exchange, "createBooking", "bookingId=" + booking.get("id") + " spotId=" + booking.get("spotId"));
            HttpResponses.json(exchange, 201, object("booking", booking));
        } catch (IllegalArgumentException error) {
            BackendLog.beforeReturn(exchange, "createBookingFailed", "error=" + error.getMessage());
            HttpResponses.json(exchange, 400, HttpResponses.error(error.getMessage()));
        }
    }
}
