import {PluginConfig, PluginRouteOptions} from '../@types/plugin';
import bodyParser from 'body-parser';

export = function configureRoutes(options: PluginRouteOptions<PluginConfig>): void {

  options.router.use(bodyParser.json());
  options.router.get('/getOgmaConfiguration', async (req, res) => {
    try {
      const LKEConfiguration = await options.getRestClient(req).config.getConfiguration();
      res.contentType('application/json');
      if (LKEConfiguration.isSuccess()) {
        res.status(200);
        res.send(JSON.stringify(LKEConfiguration.body.ogma));
      } else {
        res.status(412);
        res.send(JSON.stringify({status: 412, body: {message: 'there was an error ogma config'}}));
      }
    } catch (e) {
      res.status(412);
      res.send(JSON.stringify({status: 412, body: e}));
    }
  });
  options.router.get('/getVisualizationConfiguration/:id&:sourceKey', async (req, res) => {
    try {
      const visualizationConfiguration = await options.getRestClient(req).visualization.getVisualization({
        sourceKey: req.params.sourceKey,
        id: +req.params.id
      });
      res.contentType('application/json');
      if (visualizationConfiguration.isSuccess()) {
        res.status(200);
        res.send(JSON.stringify(visualizationConfiguration.body));
      } else {
        res.status(412);
        res.send(JSON.stringify({status: 412, body: {message: 'there was an error gettting the viz config'}}));
      }
    } catch (e) {
      res.status(412);
      res.send(JSON.stringify({status: 412, body: e}));
    }
  });
};
