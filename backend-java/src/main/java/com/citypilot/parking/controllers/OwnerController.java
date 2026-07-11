package com.citypilot.parking.controllers;

import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.http.RequestBodies;
import com.citypilot.parking.services.OwnerService;
import com.citypilot.parking.utils.BackendLog;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.Map;

public class OwnerController {
    private final OwnerService ownerService;

    public OwnerController(OwnerService ownerService) {
        this.ownerService = ownerService;
    }

    public void getOwner(HttpExchange exchange) throws IOException {
        Map<String, Object> owner = ownerService.getOwnerProfile();
        BackendLog.beforeReturn(exchange, "getOwner", "renting=" + owner.get("renting"));
        HttpResponses.json(exchange, 200, owner);
    }

    public void updateRentStatus(HttpExchange exchange) throws IOException {
        try {
            Map<String, Object> body = RequestBodies.jsonObject(exchange);
            Map<String, Object> owner = ownerService.setRentStatus(body);
            BackendLog.beforeReturn(exchange, "updateRentStatus", "renting=" + owner.get("renting"));
            HttpResponses.json(exchange, 200, owner);
        } catch (IllegalArgumentException error) {
            BackendLog.beforeReturn(exchange, "updateRentStatusFailed", "error=" + error.getMessage());
            HttpResponses.json(exchange, 400, HttpResponses.error(error.getMessage()));
        }
    }

    public void createOwnerSpot(HttpExchange exchange) throws IOException {
        Map<String, Object> body = RequestBodies.jsonObject(exchange);
        Map<String, Object> result = ownerService.createOwnerSpot(body);
        BackendLog.beforeReturn(exchange, "createOwnerSpot", "spotCreated=true");
        HttpResponses.json(exchange, 201, result);
    }
}
