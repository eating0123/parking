package com.citypilot.parking.http;

import com.citypilot.parking.utils.JsonUtil;
import com.sun.net.httpserver.HttpExchange;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

public class RequestBodies {
    public static Map<String, Object> jsonObject(HttpExchange exchange) throws IOException {
        String raw = read(exchange.getRequestBody());
        if (raw.trim().isEmpty()) {
            return JsonUtil.emptyObject();
        }
        return JsonUtil.parseObject(raw);
    }

    private static String read(InputStream in) throws IOException {
        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        byte[] chunk = new byte[4096];
        int read;
        while ((read = in.read(chunk)) != -1) {
            buffer.write(chunk, 0, read);
            if (buffer.size() > 1_000_000) {
                throw new IOException("request body too large");
            }
        }
        return buffer.toString(StandardCharsets.UTF_8.name());
    }
}
