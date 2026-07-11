const { json } = require("./http");

function createRouter() {
  const routes = [];

  function add(method, path, handler) {
    routes.push({ method, path, handler });
  }

  async function handle(req, res, url) {
    const route = routes.find(item => item.method === req.method && item.path === url.pathname);
    if (!route) {
      return json(res, 404, { error: "api not found", path: url.pathname });
    }
    return route.handler(req, res, url);
  }

  return {
    get: (path, handler) => add("GET", path, handler),
    post: (path, handler) => add("POST", path, handler),
    patch: (path, handler) => add("PATCH", path, handler),
    handle
  };
}

module.exports = {
  createRouter
};
