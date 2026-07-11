# PARKING GENIE  可妙停

可妙停是一个面向错峰共享停车的产品。当前可运行版本由 `frontend/` 静态前端和 `backend-java/` Java 后端组成：Java 服务负责 API、mock 数据、搜索推荐逻辑，并同时托管前端页面。

## 当前实现

- `frontend/`：无构建静态前端，入口为 `frontend/index.html`。页面包含找车位、小停 AI、我要出租、我的订单、预约/支付/锁定车位等流程。
- `frontend/app.js`、`frontend/styles.css`：轻量静态版前端代码，保留用于开发和对照。
- `frontend/amap-parking.js`：高德地图增强脚本，会读取 `/api/spots` 并在页面内渲染车位点位。
- `frontend/parking-images/`：车位上传/展示相关图片资源。
- `backend-java/`：当前主后端，基于 Java 11+ 和 JDK 自带 `HttpServer`，无 Spring、Maven 或 Gradle 依赖。
- `backend-java/src/main/java/com/citypilot/parking/controllers/`：HTTP 控制器。
- `backend-java/src/main/java/com/citypilot/parking/services/`：搜索、推荐、计费、预约、社区片区、车主出租等业务逻辑。
- `backend-java/src/main/java/com/citypilot/parking/repositories/`：内存 mock 数据仓库。
- `backend-java/src/main/java/com/citypilot/parking/http/`：轻量路由、静态文件服务、请求体解析和 JSON 响应。
- `backend-java/src/main/java/com/citypilot/parking/utils/`：日志与无依赖 JSON 工具。
- `backend/`、根目录旧 HTML 和桥接脚本：早期原型/Node 版本，当前主流程不依赖它们。

## 环境要求

- Java 11 或更高版本
- Node.js 18 或更高版本，仅用于执行 `npm run dev` / `npm start` 脚本

也可以不使用 Node，直接运行 `sh backend-java/run.sh`。

## 本地启动

```bash
npm run dev
```

或：

```bash
sh backend-java/run.sh
```

服务默认监听：

```text
http://localhost:3000
```

启动脚本会执行：

1. 清理并创建 `backend-java/out`
2. 编译 `backend-java/src/main/java` 下的全部 Java 文件
3. 启动 `com.citypilot.parking.CityPilotApplication`

可通过环境变量修改端口：

```bash
PORT=8080 sh backend-java/run.sh
```

## 前端访问规则

Java 服务会托管仓库内的静态文件：

- `/` -> `frontend/index.html`
- `/amap-parking.js` -> `frontend/amap-parking.js`
- `/parking-images/*` -> `frontend/parking-images/*`
- `/frontend/*` -> `frontend/` 下对应资源

`frontend/index.html` 是当前主要展示页，页面内会请求同源 `/api/*` 接口。

## 功能范围

- 附近车位列表、地图点位和筛选：即时停、预约、月卡、无坡道、大车位、大客车、充电桩、室内近梯。
- 地点/车位搜索：本地车位关键词匹配，并结合高德 POI 结果按距离排序。
- 小停 AI 推荐：根据自然语言停车需求识别充电、无坡道、室内、大车、便宜、附近、包月、过夜等偏好。
- 预约支付流程：选择时间、确认费用、创建订单、锁定车位、到达停车、结算演示。
- 社区片区：支持枣园、黄村西里、康庄、西红门等片区数据和按坐标/片区定位。
- 车主出租：查看收益、切换出租状态、新增共享车位、企业园区错峰方案展示。
- 我的订单：展示历史订单和本次 demo 创建的预约记录。

## API

### 健康检查

- `GET /api/health`

返回 Java 服务状态。

### 车位与订单

- `GET /api/spots`

返回全部 mock 车位。

- `GET /api/search?q=关键词&city=北京`

搜索车位和 POI。参数 `q` 也可写作 `keyword`；`city` 默认是 `北京`。服务会优先读取环境变量 `AMAP_WEB_SERVICE_KEY`、`AMAP_REST_KEY`、`AMAP_KEY` 作为高德 Web 服务 Key，建议本地配置自己的 Key。

- `POST /api/recommend`

请求示例：

```json
{
  "text": "今晚停到明早，最好有充电位",
  "evOnly": false,
  "smartNoSlope": false,
  "smartCovered": false,
  "smartSize": "any",
  "durSel": "4小时"
}
```

返回推荐车位、匹配分、筛选条件、预计费用和回复文案。

- `POST /api/bookings`

请求示例：

```json
{
  "spotId": 2,
  "mode": "future",
  "dateSel": "今晚 19:00",
  "durSel": "至明早8点"
}
```

创建并返回 demo 预约订单。

- `GET /api/orders`

返回历史订单和本次运行期内创建的预约订单。

### 社区片区

- `GET /api/community`
- `GET /api/community/districts`

返回片区列表。

- `GET /api/community/spots?district=zaoyuan`

返回指定片区的车位。`district` 也可写作 `key`。

- `GET /api/community/locate?lng=116.3236&lat=39.7550`
- `POST /api/community/locate`

按坐标或片区 key 匹配片区。`POST` 请求可传：

```json
{
  "district": "zaoyuan"
}
```

或：

```json
{
  "location": {
    "lng": 116.3236,
    "lat": 39.755
  }
}
```

### 车主与企业错峰

- `GET /api/owner`

返回车主收益、当前车位和企业园区错峰数据。

- `PATCH /api/owner/rent-status`

请求示例：

```json
{
  "renting": true
}
```

切换出租状态。

- `POST /api/owner/spots`

请求示例：

```json
{
  "name": "枣园北里 · B-07",
  "window": "工作日 08:30 - 18:00",
  "price": "¥4 / 时"
}
```

创建 demo 共享车位，并返回更新后的车主信息。

## 数据说明

后端数据全部存放在 `backend-java/src/main/java/com/citypilot/parking/repositories/DataStore.java`，当前包含：

- 24 个大兴区周边车位，覆盖社区、商场、企业、个人车位。
- 4 个社区片区：枣园片区、黄村西里片区、康庄片区、西红门片区。
- 车主收益、企业园区车位联营、历史订单等 mock 数据。
- 新建预约和新增车位只保存在当前 Java 进程内，重启后会恢复初始 mock 数据。

## 常用命令

```bash
npm run dev       # 编译并启动 Java demo 服务
npm start         # 同 npm run dev
npm run dev:node  # 启动旧 Node 后端，仅作对照
```
