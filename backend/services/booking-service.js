const parkingRepository = require("../repositories/parking-repository");
const { calculateOrderAmount } = require("./pricing-service");
const { badRequest, notFound } = require("../utils/errors");

function createBooking(input) {
  if (!input.spotId) {
    throw badRequest("spotId is required");
  }

  const spot = parkingRepository.findSpotById(input.spotId);
  if (!spot) {
    throw notFound("spot not found", { spotId: input.spotId });
  }

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

  return parkingRepository.createBooking(booking);
}

module.exports = {
  createBooking
};
