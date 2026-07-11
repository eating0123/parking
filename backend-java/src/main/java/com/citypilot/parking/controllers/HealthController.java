package com.citypilot.parking.controllers;

import com.citypilot.parking.http.HttpResponses;
import com.citypilot.parking.utils.BackendLog;
import com.sun.net.httpserver.HttpExchange;

import java.io.IOException;

import static com.citypilot.parking.utils.JsonUtil.object;

public class HealthController {
    public void health(HttpExchange exchange) throws IOException {
        Object response = object(
                "ok", true,
                "service", "citypilot-parking-api",
                "runtime", "java",
                "version", "0.1.0"
        );
        BackendLog.beforeReturn(exchange, "health", "service=citypilot-parking-api runtime=java");
        HttpResponses.json(exchange, 200, response);
    }
}
