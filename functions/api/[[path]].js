const spots = [
  {
    "id": 1,
    "name": "枣园北里 12号院",
    "addr": "兴华大街三段 · 小区内部地面车位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 3,
    "cap": 15,
    "window": "19:00-次日8:00",
    "dist": "280m",
    "walk": "4分钟",
    "count": 4,
    "ev": false,
    "monthly": 168,
    "x": 32,
    "y": 38,
    "lng": 116.323627,
    "lat": 39.754978,
    "noSlope": true,
    "size": "standard",
    "covered": false,
    "elevator": true,
    "code": "ZY-B07",
    "rule": "夜间封顶 ¥15，白天需在 8:00 前驶离",
    "occupancy": 72
  },
  {
    "id": 2,
    "name": "大兴荟聚 P2",
    "addr": "欣宁街 15 号 · 商场地下车库 P2 层",
    "type": "mall",
    "badge": "商场认证",
    "rate": 2,
    "cap": 12,
    "window": "22:00-次日9:00",
    "dist": "450m",
    "walk": "6分钟",
    "count": 23,
    "ev": true,
    "monthly": 168,
    "x": 58,
    "y": 30,
    "lng": 116.327525,
    "lat": 39.787658,
    "noSlope": true,
    "size": "large",
    "covered": true,
    "elevator": true,
    "code": "P2-089",
    "rule": "车牌识别自动抬杆，P2 有 8 个充电位",
    "occupancy": 54
  },
  {
    "id": 3,
    "name": "魏师傅的车位",
    "addr": "高米店南 3 栋 102 · 产权私家车位",
    "type": "personal",
    "badge": "个人车位",
    "rate": 4,
    "cap": 0,
    "window": "08:00-18:00",
    "dist": "190m",
    "walk": "3分钟",
    "count": 1,
    "ev": false,
    "monthly": 0,
    "x": 44,
    "y": 55,
    "lng": 116.331605,
    "lat": 39.763489,
    "noSlope": false,
    "size": "standard",
    "covered": false,
    "elevator": false,
    "code": "WSF-01",
    "rule": "车主白天上班出借，18:00 前须驶离",
    "occupancy": 31
  },
  {
    "id": 4,
    "name": "生物医药基地 P1",
    "addr": "永大路 38 号 · 企业错峰车位",
    "type": "mall",
    "badge": "企业认证",
    "rate": 2.5,
    "cap": 14,
    "window": "19:00-次日8:30",
    "dist": "620m",
    "walk": "9分钟",
    "count": 15,
    "ev": true,
    "monthly": 198,
    "x": 70,
    "y": 62,
    "lng": 116.299709,
    "lat": 39.687555,
    "noSlope": true,
    "size": "bus",
    "covered": true,
    "elevator": false,
    "code": "BIO-A12",
    "rule": "需从东门闸机进入，凭订单码抬杆",
    "occupancy": 46
  },
  {
    "id": 5,
    "name": "黄村西里 5号院",
    "addr": "兴丰大街 · 老旧小区免费共享位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "19:00-次日8:00",
    "dist": "350m",
    "walk": "5分钟",
    "count": 2,
    "ev": false,
    "monthly": 0,
    "x": 24,
    "y": 66,
    "lng": 116.33917,
    "lat": 39.73682,
    "noSlope": true,
    "size": "large",
    "covered": false,
    "elevator": true,
    "code": "HC-05",
    "rule": "老旧小区夜间免费共享，需按时驶离",
    "occupancy": 83
  },
  {
    "id": 6,
    "name": "李阿姨的车位",
    "addr": "旧宫德茂家园 7 栋前 · 产权私家车位",
    "type": "personal",
    "badge": "个人车位",
    "rate": 3,
    "cap": 0,
    "window": "全天可约",
    "dist": "520m",
    "walk": "8分钟",
    "count": 1,
    "ev": false,
    "monthly": 0,
    "x": 80,
    "y": 44,
    "lng": 116.438754,
    "lat": 39.778045,
    "noSlope": false,
    "size": "large",
    "covered": false,
    "elevator": false,
    "code": "LAA-06",
    "rule": "长租优先，可与车主协商包月",
    "occupancy": 35
  },
  {
    "id": 7,
    "name": "康庄老旧小区东院",
    "addr": "康庄路 · 居委会夜间免费车位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "20:00-次日7:30",
    "dist": "680m",
    "walk": "10分钟",
    "count": 8,
    "ev": false,
    "monthly": 0,
    "x": 18,
    "y": 42,
    "lng": 116.342233,
    "lat": 39.755599,
    "noSlope": true,
    "size": "standard",
    "covered": false,
    "elevator": true,
    "code": "KZ-07",
    "rule": "免费错峰共享，需登记车牌",
    "occupancy": 62
  },
  {
    "id": 8,
    "name": "清源西里北门",
    "addr": "清源路 · 老旧小区划线共享位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "18:30-次日8:00",
    "dist": "760m",
    "walk": "11分钟",
    "count": 5,
    "ev": false,
    "monthly": 0,
    "x": 38,
    "y": 24,
    "lng": 116.335119,
    "lat": 39.744259,
    "noSlope": true,
    "size": "standard",
    "covered": false,
    "elevator": false,
    "code": "QY-08",
    "rule": "免费车位先到先得，预约后保留 10 分钟",
    "occupancy": 70
  },
  {
    "id": 9,
    "name": "兴丰家园社区泊位",
    "addr": "兴丰北大街 · 社区公共泊位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "全天可约",
    "dist": "930m",
    "walk": "13分钟",
    "count": 12,
    "ev": false,
    "monthly": 0,
    "x": 13,
    "y": 72,
    "lng": 116.339767,
    "lat": 39.735022,
    "noSlope": true,
    "size": "large",
    "covered": false,
    "elevator": true,
    "code": "XF-09",
    "rule": "社区便民免费位，大车优先停靠外侧",
    "occupancy": 57
  },
  {
    "id": 10,
    "name": "高米店企业园 P3",
    "addr": "金星西路 · 企业错峰地下车位",
    "type": "mall",
    "badge": "企业认证",
    "rate": 2.2,
    "cap": 13,
    "window": "19:00-次日8:30",
    "dist": "1.1km",
    "walk": "15分钟",
    "count": 32,
    "ev": true,
    "monthly": 188,
    "x": 64,
    "y": 40,
    "lng": 116.332354,
    "lat": 39.765082,
    "noSlope": true,
    "size": "large",
    "covered": true,
    "elevator": true,
    "code": "GMD-P3",
    "rule": "园区批量接入，车牌识别入场",
    "occupancy": 42
  },
  {
    "id": 11,
    "name": "大兴机场换乘 P5",
    "addr": "机场北线 · 大客车临停区",
    "type": "mall",
    "badge": "企业认证",
    "rate": 4,
    "cap": 28,
    "window": "全天可约",
    "dist": "1.8km",
    "walk": "换乘8分钟",
    "count": 60,
    "ev": true,
    "monthly": 0,
    "x": 83,
    "y": 71,
    "lng": 116.43028,
    "lat": 39.558983,
    "noSlope": true,
    "size": "bus",
    "covered": true,
    "elevator": false,
    "code": "PKX-P5",
    "rule": "支持大客车与新能源车，需从北门进入",
    "occupancy": 50
  },
  {
    "id": 12,
    "name": "旧宫地铁站 P+R",
    "addr": "旧宫站东侧 · 换乘停车场",
    "type": "mall",
    "badge": "站点认证",
    "rate": 1.5,
    "cap": 10,
    "window": "06:00-23:00",
    "dist": "1.4km",
    "walk": "地铁2站",
    "count": 45,
    "ev": true,
    "monthly": 138,
    "x": 78,
    "y": 22,
    "lng": 116.460789,
    "lat": 39.80691,
    "noSlope": true,
    "size": "standard",
    "covered": false,
    "elevator": true,
    "code": "JG-PR",
    "rule": "换乘优惠，需绑定地铁乘车记录",
    "occupancy": 48
  },
  {
    "id": 13,
    "name": "观音寺街道共享位",
    "addr": "观音寺南里 · 免费错峰泊位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "19:00-次日8:00",
    "dist": "610m",
    "walk": "9分钟",
    "count": 6,
    "ev": false,
    "monthly": 0,
    "x": 28,
    "y": 49,
    "lng": 116.349591,
    "lat": 39.723947,
    "noSlope": true,
    "size": "standard",
    "covered": false,
    "elevator": true,
    "code": "GYS-13",
    "rule": "居委会认证免费共享，限小型车",
    "occupancy": 66
  },
  {
    "id": 14,
    "name": "绿地缤纷城 P1",
    "addr": "金星西路 · 商场地下车库 P1",
    "type": "mall",
    "badge": "商场认证",
    "rate": 3,
    "cap": 18,
    "window": "10:00-22:30",
    "dist": "820m",
    "walk": "12分钟",
    "count": 38,
    "ev": true,
    "monthly": 218,
    "x": 52,
    "y": 72,
    "lng": 116.334588,
    "lat": 39.763598,
    "noSlope": true,
    "size": "large",
    "covered": true,
    "elevator": true,
    "code": "LD-P1",
    "rule": "P1 近电梯厅，新能源位 12 个",
    "occupancy": 44
  },
  {
    "id": 15,
    "name": "大悦春风里 P3",
    "addr": "黄村东大街 · 商场地下车库",
    "type": "mall",
    "badge": "商场认证",
    "rate": 2.8,
    "cap": 16,
    "window": "09:30-23:00",
    "dist": "1.2km",
    "walk": "公交8分钟",
    "count": 41,
    "ev": true,
    "monthly": 208,
    "x": 61,
    "y": 76,
    "lng": 116.3413,
    "lat": 39.730841,
    "noSlope": true,
    "size": "large",
    "covered": true,
    "elevator": true,
    "code": "DY-P3",
    "rule": "电梯直达商场，宽车位优先",
    "occupancy": 41
  },
  {
    "id": 16,
    "name": "狼垡社区夜间共享",
    "addr": "狼垡东路 · 老旧小区免费位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "20:00-次日7:00",
    "dist": "1.6km",
    "walk": "公交10分钟",
    "count": 14,
    "ev": false,
    "monthly": 0,
    "x": 10,
    "y": 34,
    "lng": 116.290453,
    "lat": 39.77663,
    "noSlope": true,
    "size": "large",
    "covered": false,
    "elevator": false,
    "code": "LF-16",
    "rule": "免费开放，需避让消防通道",
    "occupancy": 59
  },
  {
    "id": 17,
    "name": "瀛海家园闲置位",
    "addr": "瀛吉街 · 小区错峰车位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 1,
    "cap": 8,
    "window": "18:00-次日8:00",
    "dist": "1.7km",
    "walk": "公交12分钟",
    "count": 9,
    "ev": false,
    "monthly": 98,
    "x": 88,
    "y": 55,
    "lng": 116.436589,
    "lat": 39.76274,
    "noSlope": true,
    "size": "standard",
    "covered": false,
    "elevator": true,
    "code": "YH-17",
    "rule": "低价便民，夜间封顶 ¥8",
    "occupancy": 53
  },
  {
    "id": 18,
    "name": "西红门产业园 P2",
    "addr": "宏业路 · 园区批量车位",
    "type": "mall",
    "badge": "企业认证",
    "rate": 2,
    "cap": 12,
    "window": "19:00-次日8:30",
    "dist": "1.5km",
    "walk": "公交9分钟",
    "count": 76,
    "ev": true,
    "monthly": 168,
    "x": 72,
    "y": 50,
    "lng": 116.332659,
    "lat": 39.784979,
    "noSlope": true,
    "size": "bus",
    "covered": true,
    "elevator": false,
    "code": "XHM-P2",
    "rule": "企业批量开放，支持大车与充电",
    "occupancy": 36
  },
  {
    "id": 19,
    "name": "榆垡便民停车场",
    "addr": "榆垡镇政府旁 · 免费公共车位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "全天可约",
    "dist": "2.1km",
    "walk": "驾车6分钟",
    "count": 24,
    "ev": false,
    "monthly": 0,
    "x": 86,
    "y": 82,
    "lng": 116.315551,
    "lat": 39.511364,
    "noSlope": true,
    "size": "bus",
    "covered": false,
    "elevator": false,
    "code": "YF-19",
    "rule": "免费公共停车场，大客车可停外圈",
    "occupancy": 40
  },
  {
    "id": 20,
    "name": "庞各庄临时停车场",
    "addr": "瓜乡桥旁 · 免费临时停车区",
    "type": "community",
    "badge": "街道认证",
    "rate": 0,
    "cap": 0,
    "window": "全天可约",
    "dist": "2.4km",
    "walk": "驾车8分钟",
    "count": 30,
    "ev": false,
    "monthly": 0,
    "x": 20,
    "y": 82,
    "lng": 116.325392,
    "lat": 39.620824,
    "noSlope": true,
    "size": "bus",
    "covered": false,
    "elevator": false,
    "code": "PGZ-20",
    "rule": "免费临停，大车需停指定区域",
    "occupancy": 45
  },
  {
    "id": 21,
    "name": "金星庄园个人位",
    "addr": "金星庄园 9 栋地下 · 个人车位",
    "type": "personal",
    "badge": "个人车位",
    "rate": 2,
    "cap": 10,
    "window": "全天可约",
    "dist": "540m",
    "walk": "8分钟",
    "count": 1,
    "ev": true,
    "monthly": 158,
    "x": 48,
    "y": 43,
    "lng": 116.383145,
    "lat": 39.7619,
    "noSlope": true,
    "size": "standard",
    "covered": true,
    "elevator": true,
    "code": "JX-21",
    "rule": "车主长期出借，带 7kW 慢充",
    "occupancy": 28
  },
  {
    "id": 22,
    "name": "西红门老街胡同位",
    "addr": "西红门路 · 老街免费共享位",
    "type": "community",
    "badge": "居委会认证",
    "rate": 0,
    "cap": 0,
    "window": "19:30-次日7:30",
    "dist": "1.3km",
    "walk": "公交8分钟",
    "count": 4,
    "ev": false,
    "monthly": 0,
    "x": 34,
    "y": 78,
    "lng": 116.330093,
    "lat": 39.794446,
    "noSlope": false,
    "size": "standard",
    "covered": false,
    "elevator": false,
    "code": "XHM-22",
    "rule": "免费共享，胡同较窄不建议大车",
    "occupancy": 78
  },
  {
    "id": 23,
    "name": "兴华桥下错峰位",
    "addr": "兴华大街桥下 · 街道错峰车位",
    "type": "community",
    "badge": "街道认证",
    "rate": 1,
    "cap": 6,
    "window": "18:00-次日8:00",
    "dist": "420m",
    "walk": "6分钟",
    "count": 18,
    "ev": false,
    "monthly": 88,
    "x": 42,
    "y": 63,
    "lng": 116.332493,
    "lat": 39.751847,
    "noSlope": true,
    "size": "large",
    "covered": true,
    "elevator": false,
    "code": "XHQ-23",
    "rule": "桥下遮雨，低价错峰开放",
    "occupancy": 49
  },
  {
    "id": 24,
    "name": "大兴政务中心 P1",
    "addr": "永华路 · 政务中心地下车库",
    "type": "mall",
    "badge": "政务认证",
    "rate": 2,
    "cap": 12,
    "window": "18:30-次日8:30",
    "dist": "970m",
    "walk": "14分钟",
    "count": 28,
    "ev": true,
    "monthly": 168,
    "x": 66,
    "y": 28,
    "lng": 116.328459,
    "lat": 39.724832,
    "noSlope": true,
    "size": "large",
    "covered": true,
    "elevator": true,
    "code": "ZW-P1",
    "rule": "晚间开放社会车辆，近电梯无坡道",
    "occupancy": 38
  }
];

const orders = [
  { id: "CP20260711001", name: "大兴荟聚 P2 · P2-089", time: "昨天 22:10 - 今天 07:42", amount: "¥12.0", state: "已完成" },
  { id: "CP20260709018", name: "枣园北里 12号院", time: "7月8日 19:33 - 23:05", amount: "¥10.5", state: "已完成" },
  { id: "CP20260706007", name: "魏师傅的车位", time: "7月6日 09:00 - 11:20", amount: "¥8.0", state: "已退款" }
];

const owner = {
  renting: true,
  revenueToday: 38,
  revenueWeek: 268,
  spot: {
    name: "枣园北里 · B-07",
    window: "工作日 08:30 - 18:00",
    price: "¥4 / 时",
    status: "出租中"
  },
  enterprise: {
    company: "北京生物医药基地园区",
    lots: 126,
    activeLots: 84,
    weeklyRevenue: 18320,
    openHours: "工作日 19:00 - 次日 08:30",
    adoption: 67,
    rows: [
      { area: "P1 东区", total: 46, shared: 32, revenue: "¥6,820", status: "已上线" },
      { area: "P1 西区", total: 38, shared: 24, revenue: "¥4,910", status: "已上线" },
      { area: "地面访客区", total: 22, shared: 16, revenue: "¥3,250", status: "审核中" },
      { area: "员工临停车区", total: 20, shared: 12, revenue: "¥3,340", status: "待联调" }
    ]
  }
};

const bookings = [];

export async function onRequest({ request, env }) {
  try {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";
    const method = request.method.toUpperCase();

    if (method === "OPTIONS") return empty(204);
    if (method === "GET" && path === "/api/health") return json({ ok: true, service: "citypilot-parking-api", version: "0.1.0", runtime: "cloudflare-pages-functions" });
    if (method === "GET" && path === "/api/spots") return json({ spots });
    if (method === "GET" && path === "/api/search") return json(await searchParking(url.searchParams, env));
    if (method === "GET" && path === "/api/orders") return json({ orders, bookings });
    if (method === "POST" && path === "/api/recommend") return json(recommendParkingSpot(await readJson(request)));
    if (method === "POST" && path === "/api/bookings") return json({ booking: createBooking(await readJson(request)) }, 201);
    if (method === "GET" && path === "/api/owner") return json(owner);
    if (method === "PATCH" && path === "/api/owner/rent-status") return json(setRentStatus(await readJson(request)));
    if (method === "POST" && path === "/api/owner/spots") return json(createOwnerSpot(await readJson(request)), 201);

    return json({ error: "Not found" }, 404);
  } catch (error) {
    return json({ error: error.message || "Internal Server Error", details: error.details }, error.status || 500);
  }
}

async function searchParking(params, env = {}) {
  const query = String(params.get("q") || params.get("keyword") || "").trim();
  if (!query) return { query, pois: [], spots, source: "empty" };

  const localMatches = searchLocalSpots(query);
  const key = env.AMAP_WEB_SERVICE_KEY || env.AMAP_REST_KEY || env.AMAP_KEY || "2d9d7b965d4ad734cad91114f500eeaa";
  if (!key) {
    return {
      query,
      pois: [],
      spots: localMatches,
      source: "local",
      warning: "AMAP_WEB_SERVICE_KEY is not configured"
    };
  }

  const city = String(params.get("city") || "北京").trim();
  const api = new URL("https://restapi.amap.com/v3/place/text");
  api.searchParams.set("key", key);
  api.searchParams.set("keywords", query);
  api.searchParams.set("city", city);
  api.searchParams.set("citylimit", "false");
  api.searchParams.set("offset", "20");
  api.searchParams.set("page", "1");
  api.searchParams.set("extensions", "base");

  const upstream = await fetch(api.toString(), {
    headers: { "Accept": "application/json" }
  });
  if (!upstream.ok) throw appError(502, "AMap search request failed", { status: upstream.status });

  const payload = await upstream.json();
  if (payload.status !== "1") {
    throw appError(502, "AMap search failed", { info: payload.info, infocode: payload.infocode });
  }

  const pois = (payload.pois || [])
    .map(normalizePoi)
    .filter(Boolean);
  const ranked = rankSpotsByPois(pois, localMatches);

  return {
    query,
    pois,
    spots: ranked,
    source: "amap"
  };
}

function normalizePoi(poi) {
  const [lng, lat] = String(poi.location || "").split(",").map(Number);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return {
    id: poi.id,
    name: poi.name,
    address: Array.isArray(poi.address) ? poi.address.join("") : String(poi.address || ""),
    type: poi.type,
    district: poi.adname,
    lng,
    lat
  };
}

function searchLocalSpots(query) {
  const q = normalizeText(query);
  return spots.filter(spot => normalizeText([
    spot.name,
    spot.addr,
    spot.badge,
    spot.rule,
    spot.window,
    spot.ev ? "充电 新能源 电车 ev" : "",
    spot.noSlope ? "无坡道 老人 电梯" : "",
    spot.covered ? "室内 地下 遮雨" : "",
    spot.rate === 0 ? "免费 0元 不收费" : "",
    spot.monthly > 0 ? "月卡 包月" : "",
    sizeLabel(spot.size)
  ].join(" ")).includes(q));
}

function rankSpotsByPois(pois, localMatches) {
  if (!pois.length) return localMatches;
  const byId = new Map();
  localMatches.forEach(spot => byId.set(spot.id, spot));

  spots
    .map(spot => {
      const nearest = Math.min(...pois.map(poi => geoDistanceMeters(spot.lng, spot.lat, poi.lng, poi.lat)));
      return { spot, nearest };
    })
    .filter(item => item.nearest <= 5000)
    .sort((a, b) => a.nearest - b.nearest)
    .forEach(item => byId.set(item.spot.id, {
      ...item.spot,
      searchDistance: Math.round(item.nearest)
    }));

  return Array.from(byId.values());
}

function geoDistanceMeters(lng1, lat1, lng2, lat2) {
  const toRad = value => value * Math.PI / 180;
  const earth = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2
    + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return earth * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function normalizeText(value) {
  return String(value || "").toLowerCase().replace(/\s+/g, "");
}

async function readJson(request) {
  const text = await request.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw appError(400, "Invalid JSON body");
  }
}

function createBooking(input) {
  if (!input.spotId) throw appError(400, "spotId is required");
  const spot = spots.find(item => item.id === Number(input.spotId));
  if (!spot) throw appError(404, "spot not found", { spotId: input.spotId });

  const durSel = input.durSel || "4小时";
  const booking = {
    id: "CP" + Date.now(),
    spotId: spot.id,
    spotName: spot.name,
    code: spot.code,
    mode: input.mode || "now",
    dateSel: input.dateSel || "现在",
    durSel,
    amount: calculateOrderAmount(spot, durSel),
    status: "paid",
    createdAt: new Date().toISOString()
  };

  bookings.unshift(booking);
  return booking;
}

function setRentStatus(input) {
  if (typeof input.renting !== "boolean") throw appError(400, "renting must be boolean");
  owner.renting = input.renting;
  owner.spot.status = owner.renting ? "出租中" : "已暂停";
  return owner;
}

function createOwnerSpot(input) {
  owner.spot = {
    name: input.name || "新增共享车位",
    window: input.window || "工作日 08:30 - 18:00",
    price: input.price || "¥4 / 时",
    status: "审核通过"
  };
  owner.renting = true;
  return { spot: owner.spot, owner };
}

function recommendParkingSpot(input) {
  const need = parseNeed(input);
  const candidates = filterCandidates(spots, need);
  const [best] = candidates
    .map(spot => ({ spot, score: scoreSpot(spot, need) }))
    .sort((a, b) => b.score - a.score);

  return {
    spotId: best.spot.id,
    spot: best.spot,
    score: Math.min(99, Math.round(best.score)),
    mode: need.mode,
    dateSel: need.dateSel,
    durSel: need.durSel,
    evOnly: need.wantsEv,
    smartNoSlope: need.noSlope,
    smartCovered: need.covered,
    smartSize: need.smartSize,
    estimatedFee: calculateOrderAmount(best.spot, need.durSel),
    reply: buildReply(best.spot, need)
  };
}

function parseNeed(input = {}) {
  const text = String(input.text || "").toLowerCase();
  const bus = /大巴|客车|团队|巴士/.test(text);
  const large = /大车|宽|suv|商务/.test(text);
  const monthly = /月卡|包月|长期|通勤/.test(text);
  const future = /今晚|明天|预约|稍后|晚上/.test(text);
  const overnight = /明早|过夜|次日|整晚/.test(text);
  const daytime = /白天|上午|下午|办事/.test(text);

  return {
    text,
    wantsEv: /充电|电车|新能源|ev/.test(text) || Boolean(input.evOnly),
    noSlope: /无坡|不爬坡|老人|长辈|轮椅|电梯/.test(text) || Boolean(input.smartNoSlope),
    covered: /室内|地下|下雨|电梯/.test(text) || Boolean(input.smartCovered),
    bus,
    large,
    cheap: /便宜|价格|省钱|免费|低价/.test(text),
    near: /近|步行|少走|地铁|附近/.test(text),
    monthly,
    overnight,
    daytime,
    smartSize: bus ? "bus" : large ? "large" : input.smartSize || "any",
    mode: monthly ? "monthly" : future || overnight ? "future" : "now",
    dateSel: monthly || future || overnight
      ? text.includes("21") ? "今晚 21:00" : text.includes("明天") ? "明天 19:00" : "今晚 19:00"
      : "现在",
    durSel: overnight ? "至明早8点" : text.includes("2") || daytime ? "2小时" : input.durSel || "4小时"
  };
}

function filterCandidates(items, need) {
  const candidates = items.filter(spot => {
    if (need.wantsEv && !spot.ev) return false;
    if (need.noSlope && !spot.noSlope) return false;
    if (need.covered && !(spot.covered || spot.elevator)) return false;
    if (need.monthly && spot.monthly <= 0) return false;
    if (need.smartSize !== "any" && spot.size !== need.smartSize && !(need.smartSize === "large" && spot.size === "bus")) return false;
    return true;
  });

  return candidates.length ? candidates : items;
}

function scoreSpot(spot, need) {
  let score = 80 - distanceMeters(spot) / 18;
  if (spot.noSlope) score += 14;
  if (spot.ev) score += need.wantsEv ? 26 : 8;
  if (spot.covered) score += need.covered ? 20 : 6;
  if (spot.elevator) score += need.noSlope ? 12 : 4;
  if (spot.size === "bus") score += need.bus ? 28 : 8;
  if (spot.size === "large") score += need.large ? 18 : 5;
  if (need.cheap) score += spot.rate === 0 ? 24 : Math.max(0, 12 - spot.rate * 3);
  if (need.near) score += Math.max(0, 20 - distanceMeters(spot) / 35);
  if (need.overnight && spot.cap > 0) score += 12;
  if (need.daytime && spot.window.startsWith("08")) score += 16;
  return score;
}

function buildReply(spot, need) {
  const reasons = [
    spot.dist + "、步行" + spot.walk,
    spot.ev ? "有充电桩" : "",
    spot.noSlope ? "无坡道" : "",
    spot.covered ? "室内车位" : "",
    sizeLabel(spot.size),
    need.cheap ? "费用更低" : ""
  ].filter(Boolean);

  return `建议选 ${spot.name}，${reasons.slice(0, 4).join("，")}。已按你的需求更新筛选，下一步可直接查看详情并锁定车位。`;
}

function hoursForDuration(duration) {
  if (duration === "2小时") return 2;
  if (duration === "至明早8点") return 10;
  return 4;
}

function calculateParkingFee(spot, duration) {
  const parking = spot.rate * hoursForDuration(duration);
  return spot.cap > 0 ? Math.min(parking, spot.cap) : parking;
}

function calculateOrderAmount(spot, duration) {
  return Number((calculateParkingFee(spot, duration) + 0.5).toFixed(1));
}

function distanceMeters(spot) {
  if (spot.dist.includes("km")) return Number.parseFloat(spot.dist) * 1000;
  return Number.parseFloat(spot.dist);
}

function sizeLabel(size) {
  return { standard: "标准位", large: "大车位", bus: "大客车位" }[size] || "标准位";
}

function appError(status, message, details) {
  const error = new Error(message);
  error.status = status;
  error.details = details;
  return error;
}

function empty(status = 204) {
  return new Response(null, { status, headers: corsHeaders() });
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
  });
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
