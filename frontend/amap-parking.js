(function () {
  const AMAP_WEB_KEY = "64967778bf636782095a55506797954c";
  const DEFAULT_CENTER = [116.326497, 39.754978];

  let loadPromise = null;
  let map = null;
  let mapHost = null;
  let pickMarker = null;

  function spots() {
    return ((window.CityPilotMock && window.CityPilotMock.spots) || [])
      .map(spot => Object.assign({}, spot, {
        lng: Number(spot.lng),
        lat: Number(spot.lat)
      }))
      .filter(spot => Number.isFinite(spot.lng) && Number.isFinite(spot.lat));
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
      [data-amap-real] { position:absolute; inset:0; z-index:0; background:#e8f0e4; }
      .amap-parking-pin { transform:translateY(-4px); display:flex; flex-direction:column; align-items:center; gap:2px; cursor:pointer; }
      .amap-parking-label { min-width:46px; padding:5px 8px; border-radius:999px; border:1px solid rgba(111,159,79,.45); background:rgba(255,255,255,.92); color:#172015; box-shadow:0 8px 18px rgba(23,32,21,.18); font-size:11px; font-weight:900; line-height:1; white-space:nowrap; text-align:center; }
      .amap-parking-pin.active .amap-parking-label { background:#6F9F4F; border-color:#6F9F4F; color:#10110F; }
      .amap-parking-dot { width:8px; height:8px; border-radius:50%; background:#6F9F4F; border:1px solid rgba(255,255,255,.9); box-shadow:0 4px 10px rgba(23,32,21,.24); }
      .amap-picked-label { padding:5px 9px; border-radius:999px; background:#172015; color:#fff; font-size:11px; font-weight:900; box-shadow:0 8px 18px rgba(23,32,21,.24); }
      .amap-logo, .amap-copyright { display:none !important; }
    `;
    document.head.appendChild(style);
  }

  function findMapPane() {
    const home = document.querySelector("[data-screen-label='找车位']");
    if (!home) return null;
    return Array.from(home.children).find(child => {
      const style = child.getAttribute("style") || "";
      return style.includes("position:absolute") && style.includes("inset:0") && style.includes("z-index:1");
    }) || null;
  }

  function visibleSpots(mapPane) {
    const all = spots();
    const text = mapPane.textContent || "";
    const visible = all.filter(spot => text.includes(spot.name));
    return visible.length ? visible : all;
  }

  function selectedSpotId() {
    const text = document.body ? document.body.textContent || "" : "";
    const selected = spots().find(spot => text.includes(spot.name) && text.includes(spot.rule));
    return selected ? selected.id : null;
  }

  function priceText(spot) {
    if (spot.rate === 0) return "免费";
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

  function clickSpotCard(mapPane, spot) {
    const candidates = Array.from(mapPane.querySelectorAll("div"))
      .filter(el => !el.closest("[data-amap-real]"))
      .filter(el => (el.textContent || "").includes(spot.name))
      .filter(el => (el.getAttribute("style") || "").includes("cursor:pointer"))
      .sort((a, b) => (a.textContent || "").length - (b.textContent || "").length);
    if (candidates[0]) candidates[0].click();
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
      if (
        style.includes("background:#E8F0E4") ||
        style.includes("right:16px;top:220px") ||
        style.includes("translate(-50%,-100%)")
      ) {
        child.style.display = "none";
      }
    });

    return host;
  }

  function renderAmap() {
    const mapPane = findMapPane();
    if (!mapPane) return;
    ensureStyle();
    const host = preparePane(mapPane);
    const list = visibleSpots(mapPane);

    loadAmap().then(AMap => {
      if (!host.isConnected) return;
      if (mapHost !== host) {
        if (map && map.destroy) map.destroy();
        mapHost = host;
        pickMarker = null;
        map = new AMap.Map(host, {
          center: DEFAULT_CENTER,
          zoom: 12,
          resizeEnable: true,
          viewMode: "2D"
        });
        map.addControl(new AMap.Scale());
        map.addControl(new AMap.ToolBar({ position: "RT" }));
        map.on("click", event => {
          if (pickMarker) map.remove(pickMarker);
          pickMarker = new AMap.Marker({
            position: event.lnglat,
            anchor: "bottom-center",
            content: '<div class="amap-picked-label">选点</div>'
          });
          map.add(pickMarker);
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
        marker.on("click", () => clickSpotCard(mapPane, spot));
        return marker;
      });
      if (markers.length) {
        map.add(markers);
        const active = list.find(spot => activeId === spot.id);
        if (active) {
          map.setZoomAndCenter(14, [active.lng, active.lat]);
        } else if (markers.length === 1) {
          map.setZoomAndCenter(14, markers[0].getPosition());
        } else {
          map.setFitView(markers, false, [92, 28, 150, 28], 14);
        }
      }
    }).catch(() => {
      host.innerHTML = '<div style="position:absolute;left:18px;right:18px;top:45%;transform:translateY(-50%);padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.9);color:#172015;font-size:12px;font-weight:800;text-align:center;box-shadow:0 12px 28px rgba(52,86,40,.14)">高德地图加载失败，请确认本地域名已加入 Web 端 Key 白名单</div>';
    });
  }

  const observer = new MutationObserver(() => {
    window.requestAnimationFrame(renderAmap);
  });

  window.addEventListener("load", () => {
    renderAmap();
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();
