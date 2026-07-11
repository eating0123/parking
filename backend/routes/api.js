const { createRouter } = require("../utils/router");
const healthController = require("../controllers/health-controller");
const parkingController = require("../controllers/parking-controller");
const ownerController = require("../controllers/owner-controller");

function createApiRouter() {
  const router = createRouter();

  router.get("/api/health", healthController.health);
  router.get("/api/spots", parkingController.listSpots);
  router.get("/api/orders", parkingController.listOrders);
  router.post("/api/recommend", parkingController.recommend);
  router.post("/api/bookings", parkingController.createBooking);

  router.get("/api/owner", ownerController.getOwner);
  router.patch("/api/owner/rent-status", ownerController.updateRentStatus);
  router.post("/api/owner/spots", ownerController.createOwnerSpot);

  return router;
}

module.exports = {
  createApiRouter
};
