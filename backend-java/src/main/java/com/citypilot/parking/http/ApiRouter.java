package com.citypilot.parking.http;

import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class ApiRouter {
    private final Map<String, RouteHandler> routes = new HashMap<>();

    public void get(String path, RouteHandler handler) {
        add("GET", path, handler);
    }

    public void post(String path, RouteHandler handler) {
        add("POST", path, handler);
    }

    public void patch(String path, RouteHandler handler) {
        add("PATCH", path, handler);
    }

    public void handle(HttpExchange exchange) throws IOException {
        String key = routeKey(exchange.getRequestMethod(), exchange.getRequestURI().getPath());
        RouteHandler handler = routes.get(key);
        if (handler == null) {
            HttpResponses.json(exchange, 404, HttpResponses.error("api not found"));
            return;
        }
        handler.handle(exchange);
    }

    private void add(String method, String path, RouteHandler handler) {
        routes.put(routeKey(method, path), handler);
    }

    private String routeKey(String method, String path) {
        return method + " " + path;
    }
}
