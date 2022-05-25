import bodyParser from "body-parser";

import { PluginConfig, PluginRouteOptions } from "../types/plugin";

export = function configureRoutes(
  options: PluginRouteOptions<PluginConfig>
): void {
  options.router.use(bodyParser.json());
  options.router.get("/getOgmaConfiguration", async (req, res) => {
    try {
      const LKEConfiguration = await options
        .getRestClient(req)
        .config.getConfiguration();
      res.contentType("application/json");
      if (LKEConfiguration.isSuccess()) {
        res.status(200);
        res.send(LKEConfiguration.body.ogma);
      } else {
        res.status(412);
        res.send({
          status: 412,
          body: { message: LKEConfiguration.body.message },
        });
      }
    } catch (e) {
      res.status(412);
      res.send({ status: 412, body: e });
    }
  });
  options.router.get(
    "/getVisualizationConfiguration/id=:id&sourceKey=:sourceKey",
    async (req, res) => {
      const params = req.params as any as { sourceKey: string; id: string };
      try {
        const visualizationConfiguration = await options
          .getRestClient(req)
          .visualization.getVisualization({
            sourceKey: params.sourceKey,
            id: Number(params.id),
          });
        res.contentType("application/json");
        if (visualizationConfiguration.isSuccess()) {
          res.status(200);
          res.send(visualizationConfiguration.body);
        } else {
          res.status(412);
          res.send({
            status: 412,
            body: { message: visualizationConfiguration.body.message },
          });
        }
      } catch (e) {
        res.status(412);
        res.send({ status: 412, body: e });
      }
    }
  );
};
