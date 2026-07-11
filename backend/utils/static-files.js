const fs = require("fs");
const path = require("path");
const { send } = require("./http");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png"
};

function createStaticHandler(frontendRoot) {
  const root = path.resolve(frontendRoot);

  return function serveStatic(req, res, url) {
    const rawPathname = url.pathname === "/" ? "/index.html" : decodeURIComponent(url.pathname);
    const pathname = rawPathname.startsWith("/frontend/") ? rawPathname.slice("/frontend".length) : rawPathname;
    const filePath = path.normalize(path.join(root, pathname));

    if (!filePath.startsWith(root)) {
      return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    }

    fs.readFile(filePath, (error, data) => {
      if (error) return send(res, 404, "Not found", "text/plain; charset=utf-8");
      return send(res, 200, data, mime[path.extname(filePath)] || "application/octet-stream");
    });
  };
}

module.exports = {
  createStaticHandler
};
