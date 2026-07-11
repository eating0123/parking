(function () {
  const AMAP_WEB_KEY = "64967778bf636782095a55506797954c";
  const DEFAULT_CENTER = [116.332493, 39.751847];

  let loadPromise = null;
  let spotPromise = null;
  let latestSpots = [];
  let map = null;
  let mapHost = null;
  let pickMarker = null;
  let pickedLngLat = null;
  let suppressNextMapClick = false;
  let selectedAmapSpotId = null;

  function toSpotList(value) {
    return (value || [])
      .map(spot => Object.assign({}, spot, {
        id: Number(spot.id),
        lng: Number(spot.lng),
        lat: Number(spot.lat)
      }))
      .filter(spot => Number.isFinite(spot.lng) && Number.isFinite(spot.lat));
  }

  function fallbackSpots() {
    return toSpotList((window.CityPilotMock && window.CityPilotMock.spots) || []);
  }

  function fetchSpots() {
    if (spotPromise) return spotPromise;
    spotPromise = fetch("/api/spots")
      .then(res => (res.ok ? res.json() : Promise.reject(new Error("spots api failed"))))
      .then(data => {
        latestSpots = toSpotList(data.spots);
        return latestSpots;
      })
      .catch(() => {
        latestSpots = fallbackSpots();
        return latestSpots;
      });
    return spotPromise;
  }

  function currentSpots() {
    return latestSpots.length ? latestSpots : fallbackSpots();
  }

  function loadAmap() {
    if (window.AMap && window.AMap.Map) return Promise.resolve(window.AMap);
    if (loadPromise) return loadPromise;
    loadPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://webapi.amap.com/maps?v=2.0&key=" + AMAP_WEB_KEY + "&plugin=AMap.Scale,AMap.ToolBar";
      script.async = true;
      script.onload = () => resolve(window.AMap);
      script.onerror = () => reject(new Error("AMap JS API load failed"));
      document.head.appendChild(script);
    });
    return loadPromise;
  }

  function ensureStyle() {
    if (document.querySelector("[data-amap-parking-style]")) return;
    const style = document.createElement("style");
    style.setAttribute("data-amap-parking-style", "1");
    style.textContent = `
      [data-amap-real] { position:absolute; inset:0; z-index:1; background:#e8f0e4; }
      .map [data-amap-real] { z-index:1; }
      .amap-parking-pin { transform:translateY(-4px); display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; border:0; padding:0; background:transparent; font:inherit; touch-action:manipulation; pointer-events:auto; }
      .amap-parking-label { min-width:46px; padding:5px 8px; border-radius:999px; border:1px solid rgba(111,159,79,.45); background:rgba(255,255,255,.92); color:#172015; box-shadow:0 8px 18px rgba(23,32,21,.18); font-size:11px; font-weight:900; line-height:1; white-space:nowrap; text-align:center; pointer-events:none; }
      .amap-parking-pin.active .amap-parking-label { background:#6F9F4F; border-color:#6F9F4F; color:#10110F; }
      .amap-parking-dot { width:8px; height:8px; border-radius:50%; background:#6F9F4F; border:1px solid rgba(255,255,255,.9); box-shadow:0 4px 10px rgba(23,32,21,.24); pointer-events:none; }
      .amap-picked-label { padding:5px 9px; border-radius:999px; background:#172015; color:#fff; font-size:11px; font-weight:900; box-shadow:0 8px 18px rgba(23,32,21,.24); }
      .amap-spot-sheet { position:absolute; left:12px; right:12px; bottom:84px; z-index:12; padding:14px; border-radius:22px; border:1px solid rgba(255,255,255,.72); background:rgba(255,255,255,.94); color:#172015; box-shadow:0 18px 44px rgba(52,86,40,.24); backdrop-filter:blur(18px); display:flex; flex-direction:column; gap:10px; font-family:-apple-system,'PingFang SC',system-ui,sans-serif; }
      .amap-spot-sheet-head { display:flex; align-items:flex-start; gap:10px; }
      .amap-spot-sheet-title { flex:1; min-width:0; display:flex; flex-direction:column; gap:3px; }
      .amap-spot-sheet-name { font-size:16px; font-weight:900; line-height:1.25; color:#172015; }
      .amap-spot-sheet-addr { font-size:11px; line-height:1.45; color:rgba(23,32,21,.58); }
      .amap-spot-sheet-price { flex:none; font-size:17px; font-weight:950; color:#4E7B36; white-space:nowrap; }
      .amap-spot-sheet-close { flex:none; width:28px; height:28px; border:0; border-radius:50%; background:rgba(23,32,21,.08); color:rgba(23,32,21,.58); font-size:18px; line-height:28px; font-weight:800; cursor:pointer; padding:0; }
      .amap-spot-sheet-facts { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:8px; }
      .amap-spot-sheet-fact { border-radius:13px; background:rgba(111,159,79,.10); border:1px solid rgba(111,159,79,.18); padding:8px 9px; display:flex; flex-direction:column; gap:3px; min-width:0; }
      .amap-spot-sheet-fact span { font-size:10px; color:rgba(23,32,21,.52); white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .amap-spot-sheet-fact b { font-size:12px; color:#172015; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .amap-spot-sheet-rule { font-size:11px; line-height:1.5; color:rgba(23,32,21,.68); background:rgba(23,32,21,.04); border-radius:12px; padding:8px 10px; }
      .amap-spot-sheet-cta { width:100%; border:0; border-radius:14px; padding:12px 0; background:#6F9F4F; color:#10110F; font-size:14px; font-weight:900; cursor:pointer; }
      .amap-parking-error { position:absolute; left:18px; right:18px; top:45%; transform:translateY(-50%); padding:12px 14px; border-radius:16px; background:rgba(255,255,255,.92); color:#172015; font-size:12px; font-weight:800; text-align:center; box-shadow:0 12px 28px rgba(52,86,40,.14); z-index:2; }
    `;
    document.head.appendChild(style);
  }

  function findBundledMapPane() {
    const home = document.querySelector("[data-screen-label='找车位']");
    if (!home) return null;
    const pan = home.querySelector("[data-pan-map]");
    return pan ? pan.parentElement : null;
  }

  function findSimpleMapPane() {
    return document.querySelector("section.map");
  }

  function findMapPane() {
    return findBundledMapPane() || findSimpleMapPane();
  }

  function visibleSpots(mapPane) {
    const all = currentSpots();
    const text = mapPane.textContent || "";
    const visible = all.filter(spot => text.includes(spot.name));
    return visible.length ? visible : all;
  }

  function selectedSpotId() {
    if (selectedAmapSpotId != null) return selectedAmapSpotId;
    const text = document.body ? document.body.textContent || "" : "";
    const selected = currentSpots().find(spot => text.includes(spot.name) && text.includes(spot.rule));
    return selected ? selected.id : null;
  }

  function priceText(spot) {
    if (Number(spot.rate) === 0) return "免费";
    return "¥" + spot.rate;
  }

  function escapeHtml(value) {
    return String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]);
  }

  function sheetPriceText(spot) {
    if (Number(spot.rate) === 0) return "免费";
    return "¥" + spot.rate + "/时";
  }

  function showSpotSheet(mapPane, spot) {
    if (!mapPane) return;
    let sheet = mapPane.querySelector("[data-amap-spot-sheet]");
    if (!sheet) {
      sheet = document.createElement("div");
      sheet.setAttribute("data-amap-spot-sheet", "1");
      sheet.className = "amap-spot-sheet";
      sheet.addEventListener("click", event => event.stopPropagation());
      mapPane.appendChild(sheet);
    }
    sheet.innerHTML = `
      <div class="amap-spot-sheet-head">
        <div class="amap-spot-sheet-title">
          <div class="amap-spot-sheet-name">${escapeHtml(spot.name)}</div>
          <div class="amap-spot-sheet-addr">${escapeHtml(spot.addr || spot.badge || "社区共享车位")}</div>
        </div>
        <div class="amap-spot-sheet-price">${escapeHtml(sheetPriceText(spot))}</div>
        <button type="button" class="amap-spot-sheet-close" aria-label="关闭车位详情">×</button>
      </div>
      <div class="amap-spot-sheet-facts">
        <div class="amap-spot-sheet-fact"><span>步行</span><b>${escapeHtml(spot.walk || "-")}</b></div>
        <div class="amap-spot-sheet-fact"><span>可用</span><b>${escapeHtml(spot.count || 0)} 个</b></div>
        <div class="amap-spot-sheet-fact"><span>距离</span><b>${escapeHtml(spot.dist || "-")}</b></div>
      </div>
      <div class="amap-spot-sheet-rule">${escapeHtml(spot.rule || spot.window || "点击预约后锁定车位")}</div>
      <button type="button" class="amap-spot-sheet-cta">预约车位</button>
    `;
    sheet.querySelector(".amap-spot-sheet-close").addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      selectedAmapSpotId = null;
      sheet.remove();
    });
    sheet.querySelector(".amap-spot-sheet-cta").addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      console.log("[citypilot-amap] static sheet cta", spot.id, spot.name);
    });
  }

  function markerContent(spot, active, onSelect) {
    const pin = document.createElement("button");
    pin.type = "button";
    pin.className = "amap-parking-pin" + (active ? " active" : "");
    pin.setAttribute("aria-label", "查看" + spot.name + "车位详情");
    pin.innerHTML = '<div class="amap-parking-label">' + priceText(spot) + '</div><div class="amap-parking-dot"></div>';
    pin.addEventListener("click", event => {
      event.preventDefault();
      event.stopPropagation();
      console.log("[citypilot-amap] marker DOM click", spot.id, spot.name);
      onSelect();
    });
    return pin;
  }

  function clickSimpleSpot(spot) {
    const target = document.querySelector('[data-action="selectSpot"][data-id="' + spot.id + '"]');
    if (!target) return false;
    target.click();
    return true;
  }

  function clickBundledSpot(mapPane, spot) {
    const roots = [mapPane, document].filter((root, index, arr) => root && arr.indexOf(root) === index);
    for (const root of roots) {
      const candidates = Array.from(root.querySelectorAll("div,button,article"))
        .filter(el => !el.closest("[data-amap-real]"))
        .filter(el => (el.textContent || "").includes(spot.name))
        .filter(el => {
          const style = el.getAttribute("style") || "";
          return style.includes("cursor:pointer")
            || el.hasAttribute("onclick")
            || el.getAttribute("role") === "button"
            || el.getAttribute("data-action") === "selectSpot";
        })
        .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);
      if (candidates[0]) {
        candidates[0].click();
        return true;
      }
    }
    return false;
  }

  function dispatchSelectSpot(spot) {
    suppressNextMapClick = true;
    window.dispatchEvent(new CustomEvent("citypilot:select-spot", {
      detail: { id: spot.id, spot }
    }));
    window.setTimeout(() => {
      suppressNextMapClick = false;
    }, 150);
  }

  function focusSpotOnMap(spot) {
    if (!map || !Number.isFinite(spot.lng) || !Number.isFinite(spot.lat)) return;
    map.setZoomAndCenter(Math.max(map.getZoom ? map.getZoom() : 15, 15), [spot.lng, spot.lat]);
  }

  function clickSpot(mapPane, spot) {
    console.log("[citypilot-amap] select spot from marker", spot.id, spot.name);
    selectedAmapSpotId = spot.id;
    focusSpotOnMap(spot);
    showSpotSheet(mapPane, spot);
    dispatchSelectSpot(spot);
    window.setTimeout(() => {
      if (selectedSpotId() === spot.id) return;
      if (clickSimpleSpot(spot)) return;
      if (clickBundledSpot(mapPane, spot)) return;
      console.log("[citypilot-amap] using static spot sheet", spot.id, spot.name);
    }, 40);
  }

  function preparePane(mapPane) {
    let host = mapPane.querySelector("[data-amap-real]");
    if (!host) {
      host = document.createElement("div");
      host.setAttribute("data-amap-real", "1");
      mapPane.insertBefore(host, mapPane.firstChild);
    }

    Array.from(mapPane.children).forEach(child => {
      if (child === host) return;
      const style = child.getAttribute("style") || "";
      const text = child.textContent || "";
      const isFakeBundledMap = child.matches("[data-pan-map], [data-map-control]") || style.includes("background:#E8F0E4") || style.includes("right:16px;top:220px") || text.includes("拖动地图");
      const isSimpleFakeMap = child.classList.contains("road") || child.classList.contains("pin");
      if (isFakeBundledMap || isSimpleFakeMap) child.style.display = "none";
    });

    Array.from(mapPane.querySelectorAll("[data-map-pin]")).forEach(pin => {
      pin.style.display = "none";
    });

    return host;
  }

  function addPickMarker(AMap, position) {
    if (!map || !position) return;
    if (pickMarker) map.remove(pickMarker);
    pickMarker = new AMap.Marker({
      position,
      anchor: "bottom-center",
      content: '<div class="amap-picked-label">选点</div>'
    });
    map.add(pickMarker);
  }

  function renderAmap() {
    const mapPane = findMapPane();
    if (!mapPane) return;
    ensureStyle();
    const host = preparePane(mapPane);

    Promise.all([fetchSpots(), loadAmap()]).then(([, AMap]) => {
      if (!host.isConnected) return;
      const list = visibleSpots(mapPane);
      if (mapHost !== host) {
        if (map && map.destroy) map.destroy();
        mapHost = host;
        pickMarker = null;
        pickedLngLat = null;
        map = new AMap.Map(host, {
          center: DEFAULT_CENTER,
          zoom: 13,
          resizeEnable: true,
          viewMode: "2D"
        });
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({ position: "RT" }));
        map.on("click", event => {
          if (suppressNextMapClick) {
            suppressNextMapClick = false;
            return;
          }
          pickedLngLat = event.lnglat;
          addPickMarker(AMap, pickedLngLat);
        });
      }

      map.clearMap();
      pickMarker = null;
      const activeId = selectedSpotId();
      const markers = list.map(spot => {
        const select = () => clickSpot(mapPane, spot);
        const marker = new AMap.Marker({
          position: [spot.lng, spot.lat],
          anchor: "bottom-center",
          content: markerContent(spot, activeId === spot.id, select)
        });
        marker.on("click", event => {
          if (event && event.originEvent) {
            event.originEvent.preventDefault();
            event.originEvent.stopPropagation();
          }
          console.log("[citypilot-amap] AMap marker click", spot.id, spot.name);
          select();
        });
        return marker;
      });
      if (markers.length) {
        map.add(markers);
        const active = list.find(spot => activeId === spot.id);
        if (active) {
          map.setZoomAndCenter(15, [active.lng, active.lat]);
        } else if (markers.length === 1) {
          map.setZoomAndCenter(15, markers[0].getPosition());
        } else {
          map.setFitView(markers, false, [92, 28, 150, 28], 15);
        }
      }
      addPickMarker(AMap, pickedLngLat);
    }).catch(() => {
      host.innerHTML = '<div class="amap-parking-error">高德地图加载失败，请确认 localhost 和 communityparking.pages.dev 已加入 Web 端 Key 白名单</div>';
    });
  }

  const observer = new MutationObserver(mutations => {
    const onlyAmapInternal = mutations.every(mutation => {
      const target = mutation.target;
      return target && target.closest && target.closest("[data-amap-real]");
    });
    if (onlyAmapInternal) return;
    window.requestAnimationFrame(renderAmap);
  });

  function boot() {
    fetchSpots().finally(renderAmap);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
