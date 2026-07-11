const parkingRepository = require("../repositories/parking-repository");
const recommendationService = require("../services/recommendation-service");
const bookingService = require("../services/booking-service");
const { json, readBody } = require("../utils/http");

function listSpots(req, res) {
  return json(res, 200, {
    spots: parkingRepository.listSpots()
  });
}

function listOrders(req, res) {
  return json(res, 200, {
    orders: parkingRepository.listOrders(),
    bookings: parkingRepository.listBookings()
  });
}

async function recommend(req, res) {
  const body = await readBody(req);
  return json(res, 200, recommendationService.recommendParkingSpot(body));
}

async function createBooking(req, res) {
  const body = await readBody(req);
  return json(res, 201, {
    booking: bookingService.createBooking(body)
  });
}

module.exports = {
  listSpots,
  listOrders,
  recommend,
  createBooking
};
