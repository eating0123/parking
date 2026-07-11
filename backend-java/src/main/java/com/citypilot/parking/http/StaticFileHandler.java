package com.citypilot.parking.http;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;

public class StaticFileHandler implements HttpHandler {
    private static final Map<String, String> MIME_TYPES = new HashMap<>();

    static {
        MIME_TYPES.put(".html", "text/html; charset=utf-8");
        MIME_TYPES.put(".css", "text/css; charset=utf-8");
        MIME_TYPES.put(".js", "text/javascript; charset=utf-8");
        MIME_TYPES.put(".json", "application/json; charset=utf-8");
        MIME_TYPES.put(".svg", "image/svg+xml; charset=utf-8");
        MIME_TYPES.put(".png", "image/png");
    }

    private final Path root;

    public StaticFileHandler(Path root) {
        this.root = root;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String rawPath = exchange.getRequestURI().getPath();
        String path = "/".equals(rawPath) ? "/frontend/index.html" : URLDecoder.decode(rawPath, StandardCharsets.UTF_8.name());
        if (path.startsWith("/parking-images/")) {
            path = "/frontend" + path;
        }
        if ("/amap-parking.js".equals(path)) {
            path = "/frontend/amap-parking.js";
        }
        Path file = root.resolve(path.substring(1)).normalize();

        if (!isAllowed(file) || !Files.exists(file) || Files.isDirectory(file)) {
            HttpResponses.bytes(exchange, 404, "Not found".getBytes(StandardCharsets.UTF_8), "text/plain; charset=utf-8");
            return;
        }

        HttpResponses.bytes(exchange, 200, Files.readAllBytes(file), contentType(file));
    }

    private boolean isAllowed(Path file) {
        if (!file.startsWith(root)) return false;
        String relative = root.relativize(file).toString();
        if ("index.html".equals(relative)) return true;
        if ("mock-data.js".equals(relative)) return true;
        if ("deepseek.js".equals(relative)) return true;
        if ("deepseek.local.js".equals(relative)) return true;
        if ("prototype-api-bridge.js".equals(relative)) return true;
        return relative.startsWith("frontend" + java.io.File.separator);
    }

    private String contentType(Path file) {
        String name = file.getFileName().toString();
        int dot = name.lastIndexOf('.');
        if (dot < 0) return "application/octet-stream";
        return MIME_TYPES.getOrDefault(name.substring(dot), "application/octet-stream");
    }
}
