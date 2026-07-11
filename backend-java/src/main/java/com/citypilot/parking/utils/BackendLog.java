package com.citypilot.parking.utils;

import com.sun.net.httpserver.HttpExchange;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class BackendLog {
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public static void beforeReturn(HttpExchange exchange, String action, String summary) {
        System.out.printf(
                "[%s] backend query completed -> %s %s | %s | returning result%n",
                LocalDateTime.now().format(FORMATTER),
                exchange.getRequestMethod(),
                exchange.getRequestURI().getPath(),
                action + ": " + summary
        );
    }
}
