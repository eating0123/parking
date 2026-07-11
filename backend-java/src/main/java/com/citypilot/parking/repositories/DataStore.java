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
    static final List<Map<String, Object>> COMMUNITY_DISTRICTS = new ArrayList<>();
    static final Map<String, Object> OWNER = new LinkedHashMap<>();

    static {
        SPOTS.add(spot(1, "枣园北里 12号院", "兴华大街三段 · 小区内部地面车位", "community", "居委会认证", 3, 15, "19:00-次日8:00", "280m", "4分钟", 4, false, 168, 32, 38, 116.323627, 39.754978, true, "standard", false, true, "ZY-B07", "夜间封顶 ¥15，白天需在 8:00 前驶离", 72));
        SPOTS.add(spot(2, "大兴荟聚 P2", "欣宁街 15 号 · 商场地下车库 P2 层", "mall", "商场认证", 2, 12, "22:00-次日9:00", "450m", "6分钟", 23, true, 168, 58, 30, 116.325575, 39.789617, true, "large", true, true, "P2-089", "车牌识别自动抬杆，P2 有 8 个充电位", 54));
        SPOTS.add(spot(3, "魏师傅的车位", "高米店南 3 栋 102 · 产权私家车位", "personal", "个人车位", 4, 0, "08:00-18:00", "190m", "3分钟", 1, false, 0, 44, 55, 116.337675, 39.768375, false, "standard", false, false, "WSF-01", "车主白天上班出借，18:00 前须驶离", 31));
        SPOTS.add(spot(4, "生物医药基地 P1", "永大路 38 号 · 企业错峰车位", "mall", "企业认证", 2.5, 14, "19:00-次日8:30", "620m", "9分钟", 15, true, 198, 70, 62, 116.299709, 39.687555, true, "bus", true, false, "BIO-A12", "需从东门闸机进入，凭订单码抬杆", 46));
        SPOTS.add(spot(5, "黄村西里 5号院", "兴丰大街 · 老旧小区免费共享位", "community", "居委会认证", 0, 0, "19:00-次日8:00", "350m", "5分钟", 2, false, 0, 24, 66, 116.339263, 39.736353, true, "large", false, true, "HC-05", "老旧小区夜间免费共享，需按时驶离", 83));
        SPOTS.add(spot(6, "李阿姨的车位", "旧宫德茂家园 7 栋前 · 产权私家车位", "personal", "个人车位", 3, 0, "全天可约", "520m", "8分钟", 1, false, 0, 80, 44, 116.447600, 39.813500, false, "large", false, false, "LAA-06", "长租优先，可与车主协商包月", 35));
        SPOTS.add(spot(7, "康庄老旧小区东院", "康庄路 · 居委会夜间免费车位", "community", "居委会认证", 0, 0, "20:00-次日7:30", "680m", "10分钟", 8, false, 0, 18, 42, 116.319800, 39.741200, true, "standard", false, true, "KZ-07", "免费错峰共享，需登记车牌", 62));
        SPOTS.add(spot(8, "清源西里北门", "清源路 · 老旧小区划线共享位", "community", "居委会认证", 0, 0, "18:30-次日8:00", "760m", "11分钟", 5, false, 0, 38, 24, 116.332800, 39.742700, true, "standard", false, false, "QY-08", "免费车位先到先得，预约后保留 10 分钟", 70));
        SPOTS.add(spot(9, "兴丰家园社区泊位", "兴丰北大街 · 社区公共泊位", "community", "居委会认证", 0, 0, "全天可约", "930m", "13分钟", 12, false, 0, 13, 72, 116.341600, 39.735100, true, "large", false, true, "XF-09", "社区便民免费位，大车优先停靠外侧", 57));
        SPOTS.add(spot(10, "高米店企业园 P3", "金星西路 · 企业错峰地下车位", "mall", "企业认证", 2.2, 13, "19:00-次日8:30", "1.1km", "15分钟", 32, true, 188, 64, 40, 116.333200, 39.763700, true, "large", true, true, "GMD-P3", "园区批量接入，车牌识别入场", 42));
        SPOTS.add(spot(11, "大兴机场换乘 P5", "机场北线 · 大客车临停区", "mall", "企业认证", 4, 28, "全天可约", "1.8km", "换乘8分钟", 60, true, 0, 83, 71, 116.422100, 39.521600, true, "bus", true, false, "PKX-P5", "支持大客车与新能源车，需从北门进入", 50));
        SPOTS.add(spot(12, "旧宫地铁站 P+R", "旧宫站东侧 · 换乘停车场", "mall", "站点认证", 1.5, 10, "06:00-23:00", "1.4km", "地铁2站", 45, true, 138, 78, 22, 116.460200, 39.806900, true, "standard", false, true, "JG-PR", "换乘优惠，需绑定地铁乘车记录", 48));
        SPOTS.add(spot(13, "观音寺街道共享位", "观音寺南里 · 免费错峰泊位", "community", "居委会认证", 0, 0, "19:00-次日8:00", "610m", "9分钟", 6, false, 0, 28, 49, 116.344800, 39.745800, true, "standard", false, true, "GYS-13", "居委会认证免费共享，限小型车", 66));
        SPOTS.add(spot(14, "绿地缤纷城 P1", "金星西路 · 商场地下车库 P1", "mall", "商场认证", 3, 18, "10:00-22:30", "820m", "12分钟", 38, true, 218, 52, 72, 116.330400, 39.760900, true, "large", true, true, "LD-P1", "P1 近电梯厅，新能源位 12 个", 44));
        SPOTS.add(spot(15, "大悦春风里 P3", "黄村东大街 · 商场地下车库", "mall", "商场认证", 2.8, 16, "09:30-23:00", "1.2km", "公交8分钟", 41, true, 208, 61, 76, 116.345500, 39.731900, true, "large", true, true, "DY-P3", "电梯直达商场，宽车位优先", 41));
        SPOTS.add(spot(16, "狼垡社区夜间共享", "狼垡东路 · 老旧小区免费位", "community", "居委会认证", 0, 0, "20:00-次日7:00", "1.6km", "公交10分钟", 14, false, 0, 10, 34, 116.292500, 39.775500, true, "large", false, false, "LF-16", "免费开放，需避让消防通道", 59));
        SPOTS.add(spot(17, "瀛海家园闲置位", "瀛吉街 · 小区错峰车位", "community", "居委会认证", 1, 8, "18:00-次日8:00", "1.7km", "公交12分钟", 9, false, 98, 88, 55, 116.456600, 39.748200, true, "standard", false, true, "YH-17", "低价便民，夜间封顶 ¥8", 53));
        SPOTS.add(spot(18, "西红门产业园 P2", "宏业路 · 园区批量车位", "mall", "企业认证", 2, 12, "19:00-次日8:30", "1.5km", "公交9分钟", 76, true, 168, 72, 50, 116.326700, 39.795900, true, "bus", true, false, "XHM-P2", "企业批量开放，支持大车与充电", 36));
        SPOTS.add(spot(19, "榆垡便民停车场", "榆垡镇政府旁 · 免费公共车位", "community", "居委会认证", 0, 0, "全天可约", "2.1km", "驾车6分钟", 24, false, 0, 86, 82, 116.301100, 39.513300, true, "bus", false, false, "YF-19", "免费公共停车场，大客车可停外圈", 40));
        SPOTS.add(spot(20, "庞各庄临时停车场", "瓜乡桥旁 · 免费临时停车区", "community", "街道认证", 0, 0, "全天可约", "2.4km", "驾车8分钟", 30, false, 0, 20, 82, 116.329100, 39.633100, true, "bus", false, false, "PGZ-20", "免费临停，大车需停指定区域", 45));
        SPOTS.add(spot(21, "金星庄园个人位", "金星庄园 9 栋地下 · 个人车位", "personal", "个人车位", 2, 10, "全天可约", "540m", "8分钟", 1, true, 158, 48, 43, 116.331800, 39.762600, true, "standard", true, true, "JX-21", "车主长期出借，带 7kW 慢充", 28));
        SPOTS.add(spot(22, "西红门老街胡同位", "西红门路 · 老街免费共享位", "community", "居委会认证", 0, 0, "19:30-次日7:30", "1.3km", "公交8分钟", 4, false, 0, 34, 78, 116.331900, 39.790700, false, "standard", false, false, "XHM-22", "免费共享，胡同较窄不建议大车", 78));
        SPOTS.add(spot(23, "兴华桥下错峰位", "兴华大街桥下 · 街道错峰车位", "community", "街道认证", 1, 6, "18:00-次日8:00", "420m", "6分钟", 18, false, 88, 42, 63, 116.325100, 39.752500, true, "large", true, false, "XHQ-23", "桥下遮雨，低价错峰开放", 49));
        SPOTS.add(spot(24, "大兴政务中心 P1", "永华路 · 政务中心地下车库", "mall", "政务认证", 2, 12, "18:30-次日8:30", "970m", "14分钟", 28, true, 168, 66, 28, 116.328779, 39.724224, true, "large", true, true, "ZW-P1", "晚间开放社会车辆，近电梯无坡道", 38));

        COMMUNITY_DISTRICTS.add(district("zaoyuan", "枣园片区", "兴华大街 · 枣园北里 / 兴华桥一带", "北京大兴区 · 枣园街道", 1, 23, 3, 2, 21, 13));
        COMMUNITY_DISTRICTS.add(district("huangcun", "黄村西里片区", "兴丰大街 · 黄村西里 / 兴丰家园一带", "北京大兴区 · 黄村街道", 5, 9, 8, 17, 15, 24));
        COMMUNITY_DISTRICTS.add(district("kangzhuang", "康庄片区", "康庄路 · 康庄 / 清源老旧小区一带", "北京大兴区 · 清源街道", 7, 8, 13, 10, 3));
        COMMUNITY_DISTRICTS.add(district("xihongmen", "西红门片区", "西红门路 · 西红门老街 / 狼垡一带", "北京大兴区 · 西红门镇", 22, 16, 18, 6, 10));

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
            int x, int y, double lng, double lat, boolean noSlope, String size, boolean covered, boolean elevator,
            String code, String rule, int occupancy
    ) {
        return object(
                "id", id, "name", name, "addr", addr, "type", type, "badge", badge,
                "rate", rate, "cap", cap, "window", window, "dist", dist, "walk", walk,
                "count", count, "ev", ev, "monthly", monthly, "x", x, "y", y,
                "lng", lng, "lat", lat,
                "noSlope", noSlope, "size", size, "covered", covered, "elevator", elevator,
                "code", code, "rule", rule, "occupancy", occupancy
        );
    }

    private static Map<String, Object> district(String key, String name, String sub, String addr, int... spots) {
        List<Integer> spotIds = new ArrayList<>();
        for (int spot : spots) spotIds.add(spot);
        return object(
                "key", key,
                "name", name,
                "sub", sub,
                "addr", addr,
                "spots", spotIds
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
