const nock = require("nock");

const scope = nock("http://localhost:5001/api")
  .get("/getVisualizationConfiguration")
  .reply(200, {})
  .get("/getOgmaConfiguration")
  .reply(200, {})
  .persist();
