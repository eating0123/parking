# CityPilot 可妙停 Demo

这是按 `CityPilot 可妙停（离线版）.html` 设计稿补出来的黑客松 demo 实现。仓库保留设计稿，同时把可运行代码拆成前后端目录。

## 目录

- `index.html`：当前默认展示页面，来自根目录设计稿版本。
- `frontend/`：备用无构建静态前端，包含找车位、AI 推荐、出租车位、我的订单和预约支付流程。
- `backend-java/`：默认后端实现，使用 Java 11 + JDK 自带 `HttpServer`，同时托管前端静态文件。内部按 `controllers/services/repositories/http/utils` 分层，便于提交展示。
- `backend/`：上一版 Node.js 后端实现，保留作对照，可通过 `npm run dev:node` 启动。
- `mock-data.js`、`deepseek.js`：原离线稿件相关 mock/桥接文件，保留作参考。

## 启动

```bash
npm run dev
```

浏览器打开：

```text
http://localhost:3000
```

## API

- `GET /api/spots`：车位列表
- `POST /api/recommend`：自然语言需求推荐车位
- `POST /api/bookings`：创建并支付 demo 订单
- `GET /api/owner`：车主/企业错峰数据
- `PATCH /api/owner/rent-status`：切换出租状态
- `POST /api/owner/spots`：新增共享车位
- `GET /api/orders`：我的订单

## Cloudflare Pages 部署

仓库已提供 `functions/api/[[path]].js`，用于在 Cloudflare Pages Functions 中承接主业务接口。Pages 项目建议配置：

- Build output directory：`frontend`
- Functions directory：`functions`

重新部署后，前端可直接同域访问 `/api/spots`、`/api/orders`、`/api/recommend`、`/api/bookings`、`/api/owner` 等接口。

## 后端分层

- `backend-java/src/main/java/com/citypilot/parking/CityPilotApplication.java`：Java 服务启动、API 路由挂载、静态文件托管。
- `backend-java/src/main/java/com/citypilot/parking/controllers/`：处理 HTTP 入参/出参。
- `backend-java/src/main/java/com/citypilot/parking/services/`：推荐算法、计费、下单、车主状态等业务逻辑。
- `backend-java/src/main/java/com/citypilot/parking/repositories/`：封装 mock 数据访问，后续可替换成数据库。
- `backend-java/src/main/java/com/citypilot/parking/http/`：轻量路由、请求体解析、JSON 响应和静态文件服务。
- `backend-java/src/main/java/com/citypilot/parking/utils/`：无依赖 JSON 序列化/解析工具。
