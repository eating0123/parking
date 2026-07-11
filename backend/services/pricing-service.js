function hoursForDuration(duration) {
  if (duration === "2小时") return 2;
  if (duration === "至明早8点") return 10;
  return 4;
}

function calculateParkingFee(spot, duration) {
  const parking = spot.rate * hoursForDuration(duration);
  return spot.cap > 0 ? Math.min(parking, spot.cap) : parking;
}

function calculateOrderAmount(spot, duration) {
  return Number((calculateParkingFee(spot, duration) + 0.5).toFixed(1));
}

module.exports = {
  hoursForDuration,
  calculateParkingFee,
  calculateOrderAmount
};
