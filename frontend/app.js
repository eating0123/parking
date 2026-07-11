const api = {
  async get(path) {
    const res = await fetch(path);
    if (!res.ok) throw new Error(path);
    return res.json();
  },
  async send(path, method, body) {
    const res = await fetch(path, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    });
    if (!res.ok) throw new Error(path);
    return res.json();
  }
};

const state = {
  tab: "home",
  view: "map",
  mode: "now",
  dateSel: "现在",
  durSel: "4小时",
  evOnly: false,
  smartNoSlope: false,
  smartCovered: false,
  smartSize: "any",
  spotId: null,
  step: null,
  holdSec: 900,
  parkedSec: 0,
  booking: null,
  aiMessages: [],
  aiRecommendedId: 2,
  aiScore: 96,
  ownerRenting: true,
  showAdd: false,
  showEnterprise: false,
  adopted: false,
  addPhoto: null,
  addPhotoPreview: "",
  data: { spots: [], orders: [], owner: null }
};

const $app = document.querySelector("#app");

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function money(value) {
  return Number(value).toFixed(1).replace(".0", "");
}

function sizeName(size) {
  return { standard: "标准位", large: "大车位", bus: "大客车位" }[size] || "标准位";
}

function hours() {
  return state.durSel === "2小时" ? 2 : state.durSel === "至明早8点" ? 10 : 4;
}

function fee(spot) {
  const parking = spot.rate * hours();
  const capped = spot.cap > 0 ? Math.min(parking, spot.cap) : parking;
  return capped + 0.5;
}

function distMeters(spot) {
  return spot.dist.includes("km") ? Number.parseFloat(spot.dist) * 1000 : Number.parseFloat(spot.dist);
}

function filteredSpots() {
  const monthly = state.mode === "monthly";
  const list = state.data.spots.filter(spot => {
    if (state.evOnly && !spot.ev) return false;
    if (state.smartNoSlope && !spot.noSlope) return false;
    if (state.smartCovered && !(spot.covered || spot.elevator)) return false;
    if (monthly && spot.monthly <= 0) return false;
    if (state.smartSize !== "any" && spot.size !== state.smartSize && !(state.smartSize === "large" && spot.size === "bus")) return false;
    return true;
  });
  return list.length ? list : state.data.spots;
}

function selectedSpot() {
  return state.data.spots.find(spot => spot.id === state.spotId) || state.data.spots[0];
}

function bestSpot() {
  return filteredSpots()
    .slice()
    .sort((a, b) => smartScore(b) - smartScore(a))[0];
}

function smartScore(spot) {
  return (spot.noSlope ? 26 : 0) + (spot.ev ? 20 : 0) + (spot.covered ? 14 : 0) + (spot.elevator ? 12 : 0) + (spot.size === "bus" ? 16 : spot.size === "large" ? 10 : 4) + (spot.rate === 0 ? 18 : 0) + Math.max(0, 26 - distMeters(spot) / 30);
}

function fmtClock(sec) {
  const s = Math.max(0, sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = s % 60;
  if (h) return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

function chip(label, action, active, value = "") {
  return `<button class="chip ${active ? "active" : ""}" data-action="${action}" data-value="${escapeHtml(value || label)}">${escapeHtml(label)}</button>`;
}

function spotPrice(spot) {
  if (state.mode === "monthly") return spot.monthly ? `¥${spot.monthly}/月` : "不可包月";
  return spot.rate === 0 ? "免费" : `¥${spot.rate}/时`;
}

function renderShell(content, showTabs = true) {
  return `
    <section class="phone">
      <header class="topbar">
        <div class="brand-row">
          <div class="logo">P</div>
          <div>
            <div class="eyebrow">北京大兴 · 错峰共享停车</div>
            <div class="title">CityPilot 可妙停</div>
          </div>
        </div>
        <button class="pill" data-action="smartPick">智能推荐</button>
      </header>
      <div class="content">${content}</div>
      ${showTabs ? renderTabs() : ""}
      ${renderModal()}
    </section>
  `;
}

function renderTabs() {
  const tabs = [
    ["home", "P", "找车位"],
    ["ai", "AI", "小停AI"],
    ["owner", "¥", "我要出租"],
    ["profile", "我", "我的"]
  ];
  return `<nav class="bottom-tabs">${tabs.map(([key, icon, label]) => `
    <button class="tab ${state.tab === key ? "active" : ""}" data-action="tab" data-value="${key}">
      <span class="tab-icon">${icon}</span><span>${label}</span>
    </button>
  `).join("")}</nav>`;
}

function renderHome() {
  const spots = filteredSpots();
  const best = bestSpot();
  const body = `
    <section class="section stack">
      <div class="row">
        <div>
          <div class="h2">附近可用车位</div>
          <div class="muted small">${spots.length} 个可用 · ${state.mode === "monthly" ? "错峰月卡" : state.dateSel + "起 " + state.durSel}</div>
        </div>
        <button class="secondary" data-action="toggleView">${state.view === "map" ? "列表" : "地图"}</button>
      </div>
      <div class="chips">
        ${chip("即时停", "mode", state.mode === "now", "now")}
        ${chip("预约", "mode", state.mode === "future", "future")}
        ${chip("月卡", "mode", state.mode === "monthly", "monthly")}
      </div>
      <div class="chips">
        ${chip("无坡道", "filter", state.smartNoSlope, "smartNoSlope")}
        ${chip("大车位", "size", state.smartSize === "large", "large")}
        ${chip("大客车", "size", state.smartSize === "bus", "bus")}
        ${chip("充电桩", "filter", state.evOnly, "evOnly")}
        ${chip("室内近梯", "filter", state.smartCovered, "smartCovered")}
      </div>
    </section>
    ${state.view === "map" ? renderMap(spots) : renderList(spots)}
    <section class="panel section">
      <div class="row">
        <div>
          <div class="h3">智能匹配</div>
          <div class="muted small">${best.name} · ${best.dist} · ${best.ev ? "可充电" : sizeName(best.size)}</div>
        </div>
        <button class="primary" data-action="selectSpot" data-id="${best.id}">查看</button>
      </div>
    </section>
    ${state.spotId ? renderSpotSheet(selectedSpot()) : ""}
  `;
  return renderShell(body);
}

function renderMap(spots) {
  return `
    <section class="map section">
      <div class="road a"></div><div class="road b"></div>
      ${spots.map(spot => `
        <button class="pin ${state.spotId === spot.id ? "active" : ""}" style="left:${spot.x}%;top:${spot.y}%;" data-action="selectSpot" data-id="${spot.id}">
          ${escapeHtml(state.view === "map" ? spotPrice(spot).replace("/时", "").replace("/月", "") : spot.name)}
        </button>
      `).join("")}
    </section>
    ${renderList(spots.slice(0, 2))}
  `;
}

function renderList(spots) {
  return `<section class="section stack">${spots.map(renderSpotCard).join("")}</section>`;
}

function renderSpotCard(spot) {
  return `
    <article class="spot-card ${state.spotId === spot.id ? "active" : ""}" data-action="selectSpot" data-id="${spot.id}">
      <div class="row">
        <div>
          <div class="h3">${escapeHtml(spot.name)}</div>
          <div class="muted small">${escapeHtml(spot.addr)}</div>
        </div>
        <div class="price">${escapeHtml(spotPrice(spot))}</div>
      </div>
      <div class="row" style="margin-top:10px;">
        <span class="badge">${escapeHtml(spot.badge)}</span>
        <span class="muted small">${spot.dist} · 步行${spot.walk} · 余${spot.count}</span>
      </div>
      <div class="muted small" style="margin-top:8px;">${spot.noSlope ? "无坡道" : "有坡道"} · ${sizeName(spot.size)} · ${spot.ev ? "充电桩" : "无充电"} · ${spot.covered ? "室内" : "地面"}</div>
    </article>
  `;
}

function renderSpotSheet(spot) {
  return `
    <aside class="sheet">
      <div class="row">
        <div>
          <div class="h2">${escapeHtml(spot.name)}</div>
          <div class="muted small">${escapeHtml(spot.rule)}</div>
        </div>
        <button class="secondary" data-action="closeSpot">关闭</button>
      </div>
      <div class="facts" style="margin:12px 0;">
        <div class="fact"><div class="muted small">步行</div><b>${spot.walk}</b></div>
        <div class="fact"><div class="muted small">可用</div><b>${spot.count} 个</b></div>
        <div class="fact"><div class="muted small">预估</div><b>¥${money(fee(spot))}</b></div>
      </div>
      <button class="primary" style="width:100%;" data-action="book">${state.mode === "monthly" ? "购买错峰月卡" : "预约车位"}</button>
    </aside>
  `;
}

function renderTimeStep() {
  const spot = selectedSpot();
  return renderShell(`
    <div class="screen-step">
      <button class="secondary" data-action="backHome">返回</button>
      <section class="panel stack">
        <div>
          <div class="h2">选择停车时间</div>
          <div class="muted small">${escapeHtml(spot.name)} · ${escapeHtml(spot.window)}</div>
        </div>
        <div class="chips">
          ${["现在", "今晚 19:00", "今晚 21:00", "明天 19:00"].map(item => chip(item, "date", state.dateSel === item, item)).join("")}
        </div>
        <div class="chips">
          ${["2小时", "4小时", "至明早8点"].map(item => chip(item, "duration", state.durSel === item, item)).join("")}
        </div>
        <div class="row">
          <span class="muted">预估费用</span>
          <span class="price">¥${money(fee(spot))}</span>
        </div>
      </section>
      <button class="primary" data-action="toConfirm">确认时间</button>
    </div>
  `, false);
}

function renderConfirmStep() {
  const spot = selectedSpot();
  const monthly = state.mode === "monthly";
  const total = monthly ? Math.max(0, spot.monthly - 10) : fee(spot);
  return renderShell(`
    <div class="screen-step">
      <button class="secondary" data-action="backHome">返回</button>
      <section class="panel stack">
        <div class="h2">确认订单</div>
        <div class="spot-card">
          <div class="h3">${escapeHtml(spot.name)}</div>
          <div class="muted small">${monthly ? "夜间错峰月卡 · 19:00-9:00 · 30 天" : state.dateSel + " 起 · " + state.durSel}</div>
        </div>
        <div class="row"><span>停车费</span><b>¥${monthly ? spot.monthly + ".0" : money(total - 0.5)}</b></div>
        <div class="row"><span>平台服务费</span><b>${monthly ? "-¥10.0" : "¥0.5"}</b></div>
        <div class="row"><span class="h3">合计</span><span class="price">¥${money(total)}</span></div>
      </section>
      <button class="primary" data-action="pay">${monthly ? "支付并开通月卡" : "支付并锁定车位"}</button>
    </div>
  `, false);
}

function renderHoldStep() {
  const spot = selectedSpot();
  return renderShell(`
    <div class="screen-step">
      <section class="panel stack">
        <div class="h2">车位已锁定</div>
        <div class="muted">请在倒计时内到达，闸机可使用订单码抬杆。</div>
        <div class="hero-number">${fmtClock(state.holdSec)}</div>
        <div class="qr">${escapeHtml(spot.code)}</div>
        <div class="spot-card">
          <div class="h3">${escapeHtml(spot.name)}</div>
          <div class="muted small">${escapeHtml(spot.addr)}</div>
        </div>
      </section>
      <button class="primary" data-action="arrived">我已到达并开始停车</button>
      <button class="danger" data-action="reset">取消订单</button>
    </div>
  `, false);
}

function renderParkedStep() {
  const spot = selectedSpot();
  const running = Math.max(spot.rate, spot.rate * Math.ceil(Math.max(1, state.parkedSec) / 3600));
  return renderShell(`
    <div class="screen-step">
      <section class="panel stack">
        <div class="h2">停车中</div>
        <div class="muted small">${escapeHtml(spot.name)} · ${escapeHtml(spot.code)}</div>
        <div class="hero-number">${fmtClock(state.parkedSec)}</div>
        <div class="row"><span>当前计费</span><span class="price">¥${money(running)}</span></div>
      </section>
      <button class="primary" data-action="settle">结束停车并结算</button>
    </div>
  `, false);
}

function renderSettledStep() {
  const spot = selectedSpot();
  const running = Math.max(spot.rate, spot.rate * Math.ceil(Math.max(1, state.parkedSec) / 3600));
  return renderShell(`
    <div class="screen-step">
      <section class="panel stack">
        <div class="h2">结算完成</div>
        <div class="row"><span>停车时长</span><b>${fmtClock(state.parkedSec)}</b></div>
        <div class="row"><span>停车费</span><b>¥${money(running)}</b></div>
        <div class="row"><span>平台服务费</span><b>¥0.5</b></div>
        <div class="row"><span class="h3">已扣款</span><span class="price">¥${money(running + 0.5)}</span></div>
      </section>
      <button class="primary" data-action="reset">完成</button>
    </div>
  `, false);
}

function renderMonthlyDoneStep() {
  const spot = selectedSpot();
  return renderShell(`
    <div class="screen-step">
      <section class="panel stack">
        <div class="h2">错峰月卡已开通</div>
        <div class="hero-number">30天</div>
        <div class="spot-card">
          <div class="h3">${escapeHtml(spot.name)}</div>
          <div class="muted small">19:00-9:00 可用 · 自动识别车牌</div>
        </div>
      </section>
      <button class="primary" data-action="reset">回到首页</button>
    </div>
  `, false);
}

function renderAi() {
  const rec = state.data.spots.find(spot => spot.id === state.aiRecommendedId) || state.data.spots[1] || state.data.spots[0];
  const messages = state.aiMessages.length ? state.aiMessages : [
    { role: "assistant", text: "告诉我时间、地点和偏好，例如“今晚停到明早，要充电位”，我会自动筛选并推荐车位。" }
  ];
  return renderShell(`
    <section class="section stack">
      <div>
        <div class="h2">小停AI</div>
        <div class="muted small">一句话选车位 · 支持时间、价格、无坡道、充电和大车位偏好</div>
      </div>
      <div class="chips">
        ${[
          "今晚停到明早，最好有充电位",
          "带老人去枣园，不想爬坡",
          "团队大巴今晚临停",
          "找步行 5 分钟内的车位"
        ].map(item => chip(item, "presetAi", false, item)).join("")}
      </div>
      <div class="panel chat">
        ${messages.map(item => `<div class="bubble ${item.role === "user" ? "user" : "assistant"}">${escapeHtml(item.text)}</div>`).join("")}
      </div>
      <form class="chat-input" data-action="aiForm">
        <input class="input" name="aiText" placeholder="输入停车需求" autocomplete="off">
        <button class="primary">发送</button>
      </form>
    </section>
    <section class="spot-card">
      <div class="row">
        <div>
          <div class="badge">匹配度 ${state.aiScore}%</div>
          <div class="h2" style="margin-top:8px;">${escapeHtml(rec.name)}</div>
          <div class="muted small">${escapeHtml(rec.addr)}</div>
        </div>
        <div class="price">¥${money(fee(rec))}</div>
      </div>
      <div class="facts" style="margin:12px 0;">
        <div class="fact"><div class="muted small">距离</div><b>${rec.dist}</b></div>
        <div class="fact"><div class="muted small">步行</div><b>${rec.walk}</b></div>
        <div class="fact"><div class="muted small">车位</div><b>${sizeName(rec.size)}</b></div>
      </div>
      <button class="primary" style="width:100%;" data-action="aiSelect">查看并锁定</button>
    </section>
  `);
}

function renderOwner() {
  const owner = state.data.owner;
  return renderShell(`
    <section class="section stats">
      <div class="stat"><div class="small">今日收入</div><b>¥${owner.revenueToday}</b></div>
      <div class="stat"><div class="small">本周收入</div><b>¥${owner.revenueWeek}</b></div>
      <div class="stat"><div class="small">采纳率</div><b>${owner.enterprise.adoption}%</b></div>
    </section>
    <section class="panel section stack">
      <div class="row">
        <div>
          <div class="h2">我的共享车位</div>
          <div class="muted small">${state.ownerRenting ? "出租中 · 平台正在匹配车主" : "已暂停出借"}</div>
        </div>
        <button class="switch ${state.ownerRenting ? "on" : ""}" data-action="toggleRent"><span class="knob"></span></button>
      </div>
      <div class="spot-card">
        <div class="h3">${escapeHtml(owner.spot.name)}</div>
        <div class="muted small">${escapeHtml(owner.spot.window)} · ${escapeHtml(owner.spot.price)}</div>
      </div>
      <button class="secondary" data-action="openAdd">新增车位</button>
    </section>
    <section class="panel section stack">
      <div class="row">
        <div>
          <div class="h2">园区错峰方案</div>
          <div class="muted small">${escapeHtml(owner.enterprise.company)} · ${owner.enterprise.activeLots}/${owner.enterprise.lots} 已上线</div>
        </div>
        <button class="secondary" data-action="openEnterprise">详情</button>
      </div>
      <div class="bar-row">
        ${[46, 62, 70, 82, 96, 88, 74].map((h, index) => `<div class="bar" style="height:${h}%;background:${index >= 3 ? "rgba(111,159,79,.86)" : "rgba(85,125,149,.35)"}"></div>`).join("")}
      </div>
      <button class="primary" data-action="adoptPrice">${state.adopted ? "已采纳智能定价" : "采纳智能定价"}</button>
    </section>
  `);
}

function renderProfile() {
  return renderShell(`
    <section class="panel section stack">
      <div class="row">
        <div>
          <div class="h2">钱包余额</div>
          <div class="muted small">自动扣款 · 订单完成后生成票据</div>
        </div>
        <div class="price">¥86.5</div>
      </div>
    </section>
    <section class="section stack">
      <div class="h2">最近订单</div>
      ${state.data.orders.map(order => `
        <article class="spot-card">
          <div class="row">
            <div>
              <div class="h3">${escapeHtml(order.name)}</div>
              <div class="muted small">${escapeHtml(order.time)}</div>
            </div>
            <div style="text-align:right;">
              <b>${escapeHtml(order.amount)}</b>
              <div class="muted small">${escapeHtml(order.state)}</div>
            </div>
          </div>
        </article>
      `).join("")}
    </section>
  `);
}

function renderModal() {
  if (state.showAdd) {
    return `
      <div class="modal-backdrop">
        <section class="modal stack">
          <div class="row"><div class="h2">新增共享车位</div><button class="secondary" data-action="closeModal">关闭</button></div>
          <input class="input" id="addName" value="枣园北里 · B-07" aria-label="车位名称">
          <input class="input" id="addWindow" value="工作日 08:30 - 18:00" aria-label="可出借时段">
          <input class="input" id="addPrice" value="¥4 / 时" aria-label="挂牌价格">
          <label class="photo-uploader" for="addPhoto">
            <input id="addPhoto" type="file" accept="image/*" aria-label="拍照或上传车位照片">
            ${state.addPhotoPreview ? `<img src="${escapeHtml(state.addPhotoPreview)}" alt="车位照片预览">` : `
              <span class="photo-icon">📷</span>
              <b>拍照 / 上传车位照片</b>
              <small>手机端会拉起相机或本地相册</small>
            `}
          </label>
          ${state.addPhoto ? `<div class="muted small">已选择：${escapeHtml(state.addPhoto.name)}</div>` : ""}
          <button class="primary" data-action="submitAdd">提交并上线</button>
        </section>
      </div>
    `;
  }
  if (state.showEnterprise) {
    const rows = state.data.owner.enterprise.rows;
    return `
      <div class="modal-backdrop">
        <section class="modal stack">
          <div class="row"><div class="h2">企业车位联营</div><button class="secondary" data-action="closeModal">关闭</button></div>
          <div class="muted small">${escapeHtml(state.data.owner.enterprise.openHours)} · 本周收入 ¥${state.data.owner.enterprise.weeklyRevenue}</div>
          <div class="table">
            ${rows.map(row => `<div class="table-row"><b>${escapeHtml(row.area)}</b><span>${row.shared}/${row.total}</span><span>${escapeHtml(row.status)}</span></div>`).join("")}
          </div>
        </section>
      </div>
    `;
  }
  return "";
}

function render() {
  if (!state.data.spots.length || !state.data.owner) return;
  if (state.step === "time") return ($app.innerHTML = renderTimeStep());
  if (state.step === "confirm") return ($app.innerHTML = renderConfirmStep());
  if (state.step === "hold") return ($app.innerHTML = renderHoldStep());
  if (state.step === "parked") return ($app.innerHTML = renderParkedStep());
  if (state.step === "settled") return ($app.innerHTML = renderSettledStep());
  if (state.step === "monthlyDone") return ($app.innerHTML = renderMonthlyDoneStep());
  if (state.tab === "ai") return ($app.innerHTML = renderAi());
  if (state.tab === "owner") return ($app.innerHTML = renderOwner());
  if (state.tab === "profile") return ($app.innerHTML = renderProfile());
  return ($app.innerHTML = renderHome());
}

async function sendAi(text) {
  if (!text.trim()) return;
  state.aiMessages.push({ role: "user", text });
  state.aiMessages.push({ role: "assistant", text: "正在结合实时供需和你的偏好计算推荐..." });
  render();
  const result = await api.send("/api/recommend", "POST", {
    text,
    evOnly: state.evOnly,
    smartNoSlope: state.smartNoSlope,
    smartCovered: state.smartCovered,
    smartSize: state.smartSize,
    durSel: state.durSel
  });
  Object.assign(state, {
    mode: result.mode,
    dateSel: result.dateSel,
    durSel: result.durSel,
    evOnly: result.evOnly,
    smartNoSlope: result.smartNoSlope,
    smartCovered: result.smartCovered,
    smartSize: result.smartSize,
    aiRecommendedId: result.spotId,
    aiScore: result.score
  });
  state.aiMessages[state.aiMessages.length - 1] = { role: "assistant", text: result.reply };
  render();
}

async function pay() {
  const spot = selectedSpot();
  const res = await api.send("/api/bookings", "POST", {
    spotId: spot.id,
    mode: state.mode,
    dateSel: state.dateSel,
    durSel: state.durSel
  });
  state.booking = res.booking;
  state.step = state.mode === "monthly" ? "monthlyDone" : "hold";
  state.holdSec = 900;
  state.parkedSec = 0;
  render();
}

async function toggleRent() {
  state.ownerRenting = !state.ownerRenting;
  state.data.owner = await api.send("/api/owner/rent-status", "PATCH", { renting: state.ownerRenting });
  render();
}

async function submitAdd() {
  const name = document.querySelector("#addName").value;
  const windowValue = document.querySelector("#addWindow").value;
  const price = document.querySelector("#addPrice").value;
  const res = await api.send("/api/owner/spots", "POST", {
    name,
    window: windowValue,
    price,
    photoName: state.addPhoto?.name || ""
  });
  state.data.owner = res.owner;
  state.ownerRenting = res.owner.renting;
  state.showAdd = false;
  state.addPhoto = null;
  state.addPhotoPreview = "";
  render();
}

$app.addEventListener("submit", event => {
  if (event.target.matches("[data-action='aiForm']")) {
    event.preventDefault();
    const input = event.target.elements.aiText;
    sendAi(input.value);
    input.value = "";
  }
});

$app.addEventListener("click", event => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  const value = target.dataset.value;
  const id = Number(target.dataset.id);

  if (action === "tab") Object.assign(state, { tab: value, step: null, spotId: null });
  if (action === "toggleView") state.view = state.view === "map" ? "list" : "map";
  if (action === "mode") Object.assign(state, { mode: value, dateSel: value === "now" ? "现在" : "今晚 19:00", spotId: null });
  if (action === "filter") {
    state[value] = !state[value];
    state.spotId = null;
  }
  if (action === "size") {
    state.smartSize = state.smartSize === value ? "any" : value;
    state.spotId = null;
  }
  if (action === "date") state.dateSel = value;
  if (action === "duration") state.durSel = value;
  if (action === "selectSpot") state.spotId = id;
  if (action === "closeSpot") state.spotId = null;
  if (action === "book") state.step = state.mode === "monthly" ? "confirm" : "time";
  if (action === "toConfirm") state.step = "confirm";
  if (action === "backHome") state.step = state.mode === "monthly" ? null : state.step === "confirm" ? "time" : null;
  if (action === "pay") return pay();
  if (action === "arrived") Object.assign(state, { step: "parked", parkedSec: 0 });
  if (action === "settle") state.step = "settled";
  if (action === "reset") Object.assign(state, { step: null, spotId: null, tab: "home" });
  if (action === "smartPick") {
    const spot = bestSpot();
    Object.assign(state, { tab: "home", view: "map", spotId: spot.id, step: null });
  }
  if (action === "presetAi") sendAi(value);
  if (action === "aiSelect") Object.assign(state, { tab: "home", view: "map", spotId: state.aiRecommendedId, step: null });
  if (action === "toggleRent") return toggleRent();
  if (action === "openAdd") Object.assign(state, { showAdd: true, addPhoto: null, addPhotoPreview: "" });
  if (action === "submitAdd") return submitAdd();
  if (action === "openEnterprise") state.showEnterprise = true;
  if (action === "closeModal") Object.assign(state, { showAdd: false, showEnterprise: false });
  if (action === "adoptPrice") state.adopted = true;
  render();
});

$app.addEventListener("change", event => {
  if (!event.target.matches("#addPhoto")) return;
  const file = event.target.files && event.target.files[0];
  if (!file) return;
  state.addPhoto = file;
  const reader = new FileReader();
  reader.onload = () => {
    state.addPhotoPreview = String(reader.result || "");
    render();
  };
  reader.readAsDataURL(file);
});

setInterval(() => {
  if (state.step === "hold" && state.holdSec > 0) {
    state.holdSec -= 1;
    render();
  }
  if (state.step === "parked") {
    state.parkedSec += 1;
    render();
  }
}, 1000);

async function init() {
  const [spotRes, orderRes, ownerRes] = await Promise.all([
    api.get("/api/spots"),
    api.get("/api/orders"),
    api.get("/api/owner")
  ]);
  state.data.spots = spotRes.spots;
  state.data.orders = orderRes.orders;
  state.data.owner = ownerRes;
  state.ownerRenting = ownerRes.renting;
  render();
}

init().catch(error => {
  $app.innerHTML = `<div class="boot">启动失败：${escapeHtml(error.message)}</div>`;
});
