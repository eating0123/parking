const parkingRepository = require("../repositories/parking-repository");
const { calculateOrderAmount } = require("./pricing-service");

function distanceMeters(spot) {
  if (spot.dist.includes("km")) return Number.parseFloat(spot.dist) * 1000;
  return Number.parseFloat(spot.dist);
}

function sizeLabel(size) {
  return { standard: "标准位", large: "大车位", bus: "大客车位" }[size] || "标准位";
}

function parseNeed(input) {
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

function filterCandidates(spots, need) {
  const candidates = spots.filter(spot => {
    if (need.wantsEv && !spot.ev) return false;
    if (need.noSlope && !spot.noSlope) return false;
    if (need.covered && !(spot.covered || spot.elevator)) return false;
    if (need.monthly && spot.monthly <= 0) return false;
    if (need.smartSize !== "any" && spot.size !== need.smartSize && !(need.smartSize === "large" && spot.size === "bus")) return false;
    return true;
  });

  return candidates.length ? candidates : spots;
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

function recommendParkingSpot(input) {
  const need = parseNeed(input);
  const spots = parkingRepository.listSpots();
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

module.exports = {
  recommendParkingSpot,
  parseNeed,
  scoreSpot
};
