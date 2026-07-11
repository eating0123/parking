const store = require("../data");

function getOwnerProfile() {
  return store.owner;
}

function updateRentStatus(renting) {
  store.owner.renting = Boolean(renting);
  store.owner.spot.status = store.owner.renting ? "出租中" : "已暂停";
  return store.owner;
}

function createOwnerSpot(input) {
  store.owner.spot = {
    name: input.name || "新增共享车位",
    window: input.window || "工作日 08:30 - 18:00",
    price: input.price || "¥4 / 时",
    status: "审核通过"
  };
  store.owner.renting = true;
  return store.owner.spot;
}

module.exports = {
  getOwnerProfile,
  updateRentStatus,
  createOwnerSpot
};
