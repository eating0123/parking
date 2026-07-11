package com.citypilot.parking.controllers;

import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.http.RequestBodies;
import com.citypilot.parking.services.CommunityService;
import com.citypilot.parking.utils.BackendLog;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.List;
import java.util.Map;

public class CommunityController {
    private final CommunityService communityService;

    public CommunityController(CommunityService communityService) {
        this.communityService = communityService;
    }

    public void listDistricts(HttpExchange exchange) throws IOException {
        Map<String, Object> result = communityService.listDistricts();
        List<?> districts = (List<?>) result.get("districts");
        BackendLog.beforeReturn(exchange, "listCommunityDistricts", "districts=" + districts.size());
        HttpResponses.json(exchange, 200, result);
    }

    public void listDistrictSpots(HttpExchange exchange) throws IOException {
        Map<String, Object> result = communityService.listDistrictSpots(exchange.getRequestURI().getRawQuery());
        Map<String, Object> district = com.citypilot.parking.utils.JsonUtil.castMap(result.get("district"));
        BackendLog.beforeReturn(exchange, "listCommunitySpots", "district=" + district.get("key") + " spots=" + result.get("spotCount"));
        HttpResponses.json(exchange, 200, result);
    }

    public void locate(HttpExchange exchange) throws IOException {
        Map<String, Object> body = RequestBodies.jsonObject(exchange);
        Map<String, Object> result = communityService.locate(body);
        returnLocate(exchange, result);
    }

    public void locateByQuery(HttpExchange exchange) throws IOException {
        Map<String, Object> result = communityService.locate(exchange.getRequestURI().getRawQuery());
        returnLocate(exchange, result);
    }

    private void returnLocate(HttpExchange exchange, Map<String, Object> result) throws IOException {
        Map<String, Object> district = com.citypilot.parking.utils.JsonUtil.castMap(result.get("district"));
        BackendLog.beforeReturn(exchange, "locateCommunity", "district=" + district.get("key") + " spots=" + result.get("spotCount"));
        HttpResponses.json(exchange, 200, result);
    }
}
