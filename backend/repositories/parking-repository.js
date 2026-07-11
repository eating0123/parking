const store = require("../data");

function listSpots() {
  return store.spots;
}

function findSpotById(id) {
  return store.spots.find(spot => spot.id === Number(id));
}

function listOrders() {
  return store.orders;
}

function createBooking(booking) {
  store.bookings.unshift(booking);
  return booking;
}

function listBookings() {
  return store.bookings;
}

module.exports = {
  listSpots,
  findSpotById,
  listOrders,
  createBooking,
  listBookings
};
