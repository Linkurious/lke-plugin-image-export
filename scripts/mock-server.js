const jsonServer = require("json-server");
const server = jsonServer.create();

const router = jsonServer.router("scripts/db.json");
const middlewares = jsonServer.defaults();

// GET '/api/configuration'
// GET '/api/vis/:id'
server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/key/visualizations/*": "/api/vis/$1",
    "/api/key/graph/schema/edge/types\\?_=:time": "/api/edgeTypes",
    "/api/key/graph/schema/node/types\\?_=:time": "/api/nodeTypes",
    "/api/config": "/api/configuration",
  })
);
server.use("/api", router);

const app = server.listen(3000, () => {
  console.log("JSON Server is running");
});

process.on("SIGTERM", () => {
  if (app.listening) app.close(() => console.log("HTTP server closed"));
});
