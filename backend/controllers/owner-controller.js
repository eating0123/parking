const ownerService = require("../services/owner-service");
const { json, readBody } = require("../utils/http");

function getOwner(req, res) {
  return json(res, 200, ownerService.getOwnerProfile());
}

async function updateRentStatus(req, res) {
  const body = await readBody(req);
  return json(res, 200, ownerService.setRentStatus(body));
}

async function createOwnerSpot(req, res) {
  const body = await readBody(req);
  return json(res, 201, ownerService.createOwnerSpot(body));
}

module.exports = {
  getOwner,
  updateRentStatus,
  createOwnerSpot
};
