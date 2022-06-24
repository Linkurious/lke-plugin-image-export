const jsonServer = require("json-server");
const server = jsonServer.create();

const router = jsonServer.router("scripts/db.json");
const middlewares = jsonServer.defaults({
  noCors: true,
});

// GET '/api/configuration'
// GET '/api/vis/:id'
server.use(middlewares);
// server.use(
//   // jsonServer.rewriter({
//   //   "/api/key/visualizations/*": "/api/vis/$1",
//   //   "/api/config": "/api/configuration",
//   // })
// );
server.use("/api", router);

server.listen(3000, () => {
  console.log("JSON Server is running");
});
