package com.citypilot.parking.repositories;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.citypilot.parking.utils.JsonUtil.object;

public class DataStore {
    static final List<Map<String, Object>> SPOTS = new ArrayList<>();
    static final List<Map<String, Object>> ORDERS = new ArrayList<>();
    static final List<Map<String, Object>> BOOKINGS = new ArrayList<>();
    static final Map<String, Object> OWNER = new LinkedHashMap<>();

    static {
        SPOTS.add(spot(1, "枣园北里 12号院", "兴华大街三段 · 小区内部地面车位", "community", "居委会认证", 3, 15, "19:00-次日8:00", "280m", "4分钟", 4, false, 168, 28, 43, true, "standard", false, true, "ZY-B07", "夜间封顶 ¥15，白天需在 8:00 前驶离", 72));
        SPOTS.add(spot(2, "大兴荟聚 P2", "欣宁街 15 号 · 商场地下车库 P2 层", "mall", "商场认证", 2, 12, "22:00-次日9:00", "450m", "6分钟", 23, true, 168, 57, 29, true, "large", true, true, "P2-089", "车牌识别自动抬杆，P2 有 8 个充电位", 54));
        SPOTS.add(spot(3, "魏师傅的车位", "高米店南 3 栋 102 · 产权私家车位", "personal", "个人车位", 4, 0, "08:00-18:00", "190m", "3分钟", 1, false, 0, 43, 56, false, "standard", false, false, "WSF-01", "车主白天上班出借，18:00 前须驶离", 31));
        SPOTS.add(spot(4, "生物医药基地 P1", "永大路 38 号 · 企业错峰车位", "enterprise", "企业认证", 2.5, 14, "19:00-次日8:30", "620m", "9分钟", 15, true, 198, 73, 61, true, "bus", true, false, "BIO-A12", "需从东门闸机进入，凭订单码抬杆", 46));
        SPOTS.add(spot(5, "黄村西里 5号院", "兴丰大街 · 老旧小区免费共享位", "community", "居委会认证", 0, 0, "19:00-次日8:00", "350m", "5分钟", 2, false, 0, 22, 68, true, "large", false, true, "HC-05", "老旧小区夜间免费共享，需按时驶离", 83));
        SPOTS.add(spot(6, "政务中心地下车库", "永华路 · 政务中心 B1", "mall", "政务认证", 2, 12, "18:30-次日8:30", "970m", "14分钟", 28, true, 168, 64, 24, true, "large", true, true, "ZW-B117", "晚间开放社会车辆，近电梯无坡道", 38));

        ORDERS.add(object("id", "CP20260711001", "name", "大兴荟聚 P2 · P2-089", "time", "昨天 22:10 - 今天 07:42", "amount", "¥12.0", "state", "已完成"));
        ORDERS.add(object("id", "CP20260709018", "name", "枣园北里 12号院", "time", "7月8日 19:33 - 23:05", "amount", "¥10.5", "state", "已完成"));
        ORDERS.add(object("id", "CP20260706007", "name", "魏师傅的车位", "time", "7月6日 09:00 - 11:20", "amount", "¥8.0", "state", "已退款"));

        OWNER.put("renting", true);
        OWNER.put("revenueToday", 38);
        OWNER.put("revenueWeek", 268);
        OWNER.put("spot", object(
                "name", "枣园北里 · B-07",
                "window", "工作日 08:30 - 18:00",
                "price", "¥4 / 时",
                "status", "出租中"
        ));
        OWNER.put("enterprise", object(
                "company", "北京生物医药基地园区",
                "lots", 126,
                "activeLots", 84,
                "weeklyRevenue", 18320,
                "openHours", "工作日 19:00 - 次日 08:30",
                "adoption", 67,
                "rows", enterpriseRows()
        ));
    }

    private static Map<String, Object> spot(
            int id, String name, String addr, String type, String badge, Object rate, int cap,
            String window, String dist, String walk, int count, boolean ev, int monthly,
            int x, int y, boolean noSlope, String size, boolean covered, boolean elevator,
            String code, String rule, int occupancy
    ) {
        return object(
                "id", id, "name", name, "addr", addr, "type", type, "badge", badge,
                "rate", rate, "cap", cap, "window", window, "dist", dist, "walk", walk,
                "count", count, "ev", ev, "monthly", monthly, "x", x, "y", y,
                "noSlope", noSlope, "size", size, "covered", covered, "elevator", elevator,
                "code", code, "rule", rule, "occupancy", occupancy
        );
    }

    private static List<Map<String, Object>> enterpriseRows() {
        List<Map<String, Object>> rows = new ArrayList<>();
        rows.add(object("area", "P1 东区", "total", 46, "shared", 32, "revenue", "¥6,820", "status", "已上线"));
        rows.add(object("area", "P1 西区", "total", 38, "shared", 24, "revenue", "¥4,910", "status", "已上线"));
        rows.add(object("area", "地面访客区", "total", 22, "shared", 16, "revenue", "¥3,250", "status", "审核中"));
        rows.add(object("area", "员工临停车区", "total", 20, "shared", 12, "revenue", "¥3,340", "status", "待联调"));
        return rows;
    }
}
