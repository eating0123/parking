package com.citypilot.parking.utils;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class JsonUtil {
    public static Map<String, Object> emptyObject() {
        return new LinkedHashMap<>();
    }

    public static Map<String, Object> object(Object... pairs) {
        Map<String, Object> map = new LinkedHashMap<>();
        for (int i = 0; i < pairs.length; i += 2) {
            map.put(String.valueOf(pairs[i]), pairs[i + 1]);
        }
        return map;
    }

    public static String stringify(Object value) {
        StringBuilder out = new StringBuilder();
        writeValue(out, value);
        return out.toString();
    }

    public static Map<String, Object> parseObject(String json) {
        Object value = new Parser(json).parseValue();
        if (!(value instanceof Map)) {
            throw new IllegalArgumentException("json body must be object");
        }
        return castMap(value);
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> castMap(Object value) {
        return (Map<String, Object>) value;
    }

    private static void writeValue(StringBuilder out, Object value) {
        if (value == null) {
            out.append("null");
        } else if (value instanceof String) {
            writeString(out, (String) value);
        } else if (value instanceof Number || value instanceof Boolean) {
            out.append(value);
        } else if (value instanceof Map) {
            writeObject(out, castMap(value));
        } else if (value instanceof Iterable) {
            writeArray(out, (Iterable<?>) value);
        } else {
            writeString(out, String.valueOf(value));
        }
    }

    private static void writeObject(StringBuilder out, Map<String, Object> map) {
        out.append('{');
        boolean first = true;
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (!first) out.append(',');
            first = false;
            writeString(out, entry.getKey());
            out.append(':');
            writeValue(out, entry.getValue());
        }
        out.append('}');
    }

    private static void writeArray(StringBuilder out, Iterable<?> values) {
        out.append('[');
        boolean first = true;
        for (Object value : values) {
            if (!first) out.append(',');
            first = false;
            writeValue(out, value);
        }
        out.append(']');
    }

    private static void writeString(StringBuilder out, String value) {
        out.append('"');
        for (int i = 0; i < value.length(); i++) {
            char ch = value.charAt(i);
            switch (ch) {
                case '"': out.append("\\\""); break;
                case '\\': out.append("\\\\"); break;
                case '\b': out.append("\\b"); break;
                case '\f': out.append("\\f"); break;
                case '\n': out.append("\\n"); break;
                case '\r': out.append("\\r"); break;
                case '\t': out.append("\\t"); break;
                default:
                    if (ch < 32) out.append(String.format("\\u%04x", (int) ch));
                    else out.append(ch);
            }
        }
        out.append('"');
    }

    private static class Parser {
        private final String text;
        private int index;

        Parser(String text) {
            this.text = text;
        }

        Object parseValue() {
            skipWhitespace();
            if (index >= text.length()) throw new IllegalArgumentException("unexpected end of json");
            char ch = text.charAt(index);
            if (ch == '{') return parseObject();
            if (ch == '[') return parseArray();
            if (ch == '"') return parseString();
            if (text.startsWith("true", index)) return literal("true", Boolean.TRUE);
            if (text.startsWith("false", index)) return literal("false", Boolean.FALSE);
            if (text.startsWith("null", index)) return literal("null", null);
            return parseNumber();
        }

        private Map<String, Object> parseObject() {
            expect('{');
            Map<String, Object> map = new LinkedHashMap<>();
            skipWhitespace();
            if (peek('}')) {
                index++;
                return map;
            }
            while (true) {
                skipWhitespace();
                String key = parseString();
                skipWhitespace();
                expect(':');
                map.put(key, parseValue());
                skipWhitespace();
                if (peek('}')) {
                    index++;
                    return map;
                }
                expect(',');
            }
        }

        private List<Object> parseArray() {
            expect('[');
            List<Object> values = new ArrayList<>();
            skipWhitespace();
            if (peek(']')) {
                index++;
                return values;
            }
            while (true) {
                values.add(parseValue());
                skipWhitespace();
                if (peek(']')) {
                    index++;
                    return values;
                }
                expect(',');
            }
        }

        private String parseString() {
            expect('"');
            StringBuilder out = new StringBuilder();
            while (index < text.length()) {
                char ch = text.charAt(index++);
                if (ch == '"') return out.toString();
                if (ch != '\\') {
                    out.append(ch);
                    continue;
                }
                if (index >= text.length()) throw new IllegalArgumentException("invalid escape");
                char esc = text.charAt(index++);
                switch (esc) {
                    case '"': out.append('"'); break;
                    case '\\': out.append('\\'); break;
                    case '/': out.append('/'); break;
                    case 'b': out.append('\b'); break;
                    case 'f': out.append('\f'); break;
                    case 'n': out.append('\n'); break;
                    case 'r': out.append('\r'); break;
                    case 't': out.append('\t'); break;
                    case 'u':
                        String hex = text.substring(index, index + 4);
                        out.append((char) Integer.parseInt(hex, 16));
                        index += 4;
                        break;
                    default:
                        throw new IllegalArgumentException("invalid escape");
                }
            }
            throw new IllegalArgumentException("unterminated string");
        }

        private Number parseNumber() {
            int start = index;
            while (index < text.length() && "-+0123456789.eE".indexOf(text.charAt(index)) >= 0) {
                index++;
            }
            String raw = text.substring(start, index);
            if (raw.contains(".") || raw.contains("e") || raw.contains("E")) return Double.parseDouble(raw);
            return Long.parseLong(raw);
        }

        private Object literal(String literal, Object value) {
            index += literal.length();
            return value;
        }

        private void expect(char expected) {
            skipWhitespace();
            if (index >= text.length() || text.charAt(index) != expected) {
                throw new IllegalArgumentException("expected '" + expected + "'");
            }
            index++;
        }

        private boolean peek(char ch) {
            skipWhitespace();
            return index < text.length() && text.charAt(index) == ch;
        }

        private void skipWhitespace() {
            while (index < text.length() && Character.isWhitespace(text.charAt(index))) index++;
        }
    }
}
