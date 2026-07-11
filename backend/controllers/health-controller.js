const { json } = require("../utils/http");

function health(req, res) {
  return json(res, 200, {
    ok: true,
    service: "citypilot-parking-api",
    version: "0.1.0"
  });
}

module.exports = {
  health
};
