const ownerRepository = require("../repositories/owner-repository");
const { badRequest } = require("../utils/errors");

function getOwnerProfile() {
  return ownerRepository.getOwnerProfile();
}

function setRentStatus(input) {
  if (typeof input.renting !== "boolean") {
    throw badRequest("renting must be boolean");
  }
  return ownerRepository.updateRentStatus(input.renting);
}

function createOwnerSpot(input) {
  const spot = ownerRepository.createOwnerSpot(input);
  return {
    spot,
    owner: ownerRepository.getOwnerProfile()
  };
}

module.exports = {
  getOwnerProfile,
  setRentStatus,
  createOwnerSpot
};
