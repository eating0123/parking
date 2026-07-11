function send(res, status, body, type = "application/json; charset=utf-8") {
  const payload = Buffer.isBuffer(body) ? body : typeof body === "string" ? body : JSON.stringify(body);
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store"
  });
  res.end(payload);
}

function json(res, status, body) {
  return send(res, status, body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", chunk => {
      raw += chunk;
      if (raw.length > 1_000_000) {
        req.destroy();
        reject(new Error("request body too large"));
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch (error) {
        reject(new Error("invalid json body"));
      }
    });
  });
}

module.exports = {
  send,
  json,
  readBody
};
