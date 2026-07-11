package com.citypilot.parking.controllers;

import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.http.RequestBodies;
import com.citypilot.parking.services.OwnerService;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;

public class OwnerController {
    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    public void getOwner(HttpExchange exchange) throws IOException {
        HttpResponses.json(exchange, 200, ownerService.getOwnerProfile());
    }

    public void updateRentStatus(HttpExchange exchange) throws IOException {
        try {
            Map<String, Object> body = RequestBodies.jsonObject(exchange);
            HttpResponses.json(exchange, 200, ownerService.setRentStatus(body));
        } catch (IllegalArgumentException error) {
            HttpResponses.json(exchange, 400, HttpResponses.error(error.getMessage()));
        }
    }

    public void createOwnerSpot(HttpExchange exchange) throws IOException {
        Map<String, Object> body = RequestBodies.jsonObject(exchange);
        HttpResponses.json(exchange, 201, ownerService.createOwnerSpot(body));
    }
}
