(function () {
  const state = {
    lastSpotId: 2,
    sentBoot: false
  };

  function post(path, body) {
    return fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).catch(() => null);
  }

  function patch(path, body) {
    return fetch(path, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body || {})
    }).catch(() => null);
  }

  function textOf(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function inferSpotId(text) {
    if (text.includes("枣园北里")) return 1;
    if (text.includes("大兴荟聚")) return 2;
    if (text.includes("魏师傅")) return 3;
    if (text.includes("生物医药基地")) return 4;
    if (text.includes("黄村西里")) return 5;
    if (text.includes("政务中心")) return 6;
    return state.lastSpotId;
  }

  function inferDuration(text) {
    if (text.includes("至明早8点")) return "至明早8点";
    if (text.includes("2小时")) return "2小时";
    return "4小时";
  }

  function currentScreenText() {
    return textOf(document.body).slice(0, 5000);
  }

  function sendBootQueries() {
    if (state.sentBoot) return;
    state.sentBoot = true;
    fetch("/api/spots").catch(() => null);
    fetch("/api/owner").catch(() => null);
  }

  document.addEventListener("DOMContentLoaded", sendBootQueries);
  setTimeout(sendBootQueries, 1200);

  document.addEventListener("click", function (event) {
    const target = event.target && event.target.closest ? event.target.closest("div,button,span") : event.target;
    const clickedText = textOf(target);
    const pageText = currentScreenText();
    const combined = clickedText + " " + pageText;

    const spotId = inferSpotId(combined);
    if (spotId) state.lastSpotId = spotId;

    if (clickedText.includes("预约车位") || clickedText.includes("确认时间")) {
      fetch("/api/spots").catch(() => null);
      return;
    }

    if (clickedText.includes("支付并锁定车位") || clickedText.includes("支付并开通月卡")) {
      post("/api/bookings", {
        spotId: state.lastSpotId,
        mode: combined.includes("月卡") ? "monthly" : combined.includes("今晚") || combined.includes("明天") ? "future" : "now",
        dateSel: combined.includes("今晚 21:00") ? "今晚 21:00" : combined.includes("明天") ? "明天 19:00" : combined.includes("今晚") ? "今晚 19:00" : "现在",
        durSel: inferDuration(combined)
      });
      return;
    }

    if (clickedText.includes("发送") || clickedText.includes("今晚停到明早") || clickedText.includes("老人同行") || clickedText.includes("大客车位")) {
      const input = document.querySelector("[data-ai-input]");
      const text = input && input.value ? input.value : clickedText || "停车推荐";
      post("/api/recommend", { text });
      return;
    }

    if (clickedText.includes("出租中") || clickedText.includes("已暂停出借")) {
      patch("/api/owner/rent-status", { renting: clickedText.includes("已暂停") });
      return;
    }

    if (clickedText.includes("提交") || clickedText.includes("个人挂牌")) {
      post("/api/owner/spots", {
        name: "枣园北里 · B-07",
        window: "工作日 08:30 - 18:00",
        price: "¥4 / 时"
      });
    }
  }, true);
})();
