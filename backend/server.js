const http = require("http");
const path = require("path");
const { createApiRouter } = require("./routes/api");
const { createStaticHandler } = require("./utils/static-files");
const { AppError } = require("./utils/errors");
const { json } = require("./utils/http");

const PORT = Number(process.env.PORT || 3000);
const ROOT = path.resolve(__dirname, "..");
const FRONTEND = path.join(ROOT, "frontend");

const apiRouter = createApiRouter();
const serveStatic = createStaticHandler(FRONTEND);

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) return await apiRouter.handle(req, res, url);
    return serveStatic(req, res, url);
  } catch (error) {
    if (error instanceof AppError) {
      return json(res, error.status, { error: error.message, details: error.details });
    }
    console.error(error);
    return json(res, 500, { error: "internal server error" });
  }
});

server.listen(PORT, () => {
  console.log(`CityPilot demo running at http://localhost:${PORT}`);
});
