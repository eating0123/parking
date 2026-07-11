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
      .amap-parking-pin { transform:translateY(-4px); display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; }
      .amap-parking-label { min-width:46px; padding:5px 8px; border-radius:999px; border:1px solid rgba(111,159,79,.45); background:rgba(255,255,255,.92); color:#172015; box-shadow:0 8px 18px rgba(23,32,21,.18); font-size:11px; font-weight:900; line-height:1; white-space:nowrap; text-align:center; }
      .amap-parking-pin.active .amap-parking-label { background:#6F9F4F; border-color:#6F9F4F; color:#10110F; }
      .amap-parking-dot { width:8px; height:8px; border-radius:50%; background:#6F9F4F; border:1px solid rgba(255,255,255,.9); box-shadow:0 4px 10px rgba(23,32,21,.24); }
      .amap-picked-label { padding:5px 9px; border-radius:999px; background:#172015; color:#fff; font-size:11px; font-weight:900; box-shadow:0 8px 18px rgba(23,32,21,.24); }
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
    const text = document.body ? document.body.textContent || "" : "";
    const selected = currentSpots().find(spot => text.includes(spot.name) && text.includes(spot.rule));
    return selected ? selected.id : null;
  }

  function priceText(spot) {
    if (Number(spot.rate) === 0) return "免费";
    return "¥" + spot.rate;
  }

  function markerContent(spot, active) {
    return `
      <div class="amap-parking-pin ${active ? "active" : ""}">
        <div class="amap-parking-label">${priceText(spot)}</div>
        <div class="amap-parking-dot"></div>
      </div>
    `;
  }

  function clickSimpleSpot(spot) {
    const target = document.querySelector('[data-action="selectSpot"][data-id="' + spot.id + '"]');
    if (target) target.click();
  }

  function clickBundledSpot(mapPane, spot) {
    const candidates = Array.from(mapPane.querySelectorAll("div"))
      .filter(el => !el.closest("[data-amap-real]"))
      .filter(el => (el.textContent || "").includes(spot.name))
      .filter(el => (el.getAttribute("style") || "").includes("cursor:pointer"))
      .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);
    if (candidates[0]) candidates[0].click();
  }

  function clickSpot(mapPane, spot) {
    clickSimpleSpot(spot);
    clickBundledSpot(mapPane, spot);
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
          pickedLngLat = event.lnglat;
          addPickMarker(AMap, pickedLngLat);
        });
      }

      map.clearMap();
      pickMarker = null;
      const activeId = selectedSpotId();
      const markers = list.map(spot => {
        const marker = new AMap.Marker({
          position: [spot.lng, spot.lat],
          anchor: "bottom-center",
          content: markerContent(spot, activeId === spot.id)
        });
        marker.on("click", () => clickSpot(mapPane, spot));
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
