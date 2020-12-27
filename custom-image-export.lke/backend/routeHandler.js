"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const body_parser_1 = __importDefault(require("body-parser"));
module.exports = function configureRoutes(options) {
    options.router.use(body_parser_1.default.json());
    options.router.get('/getOgmaConfiguration', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const LKEConfiguration = yield options.getRestClient(req).config.getConfiguration();
            res.contentType('application/json');
            if (LKEConfiguration.isSuccess()) {
                res.status(200);
                res.send(JSON.stringify(LKEConfiguration.body.ogma));
            }
            else {
                res.status(412);
                res.send(JSON.stringify({ status: 412, body: { message: 'there was an error ogma config' } }));
            }
        }
        catch (e) {
            res.status(412);
            res.send(JSON.stringify({ status: 412, body: e }));
        }
    }));
    options.router.get('/getVisualizationConfiguration/:id&:sourceKey', (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            const visualizationConfiguration = yield options.getRestClient(req).visualization.getVisualization({
                sourceKey: req.params.sourceKey,
                id: +req.params.id
            });
            res.contentType('application/json');
            if (visualizationConfiguration.isSuccess()) {
                res.status(200);
                res.send(JSON.stringify(visualizationConfiguration.body));
            }
            else {
                res.status(412);
                res.send(JSON.stringify({ status: 412, body: { message: 'there was an error gettting the viz config' } }));
            }
        }
        catch (e) {
            res.status(412);
            res.send(JSON.stringify({ status: 412, body: e }));
        }
    }));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVIYW5kbGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL2JhY2tlbmQvcm91dGVIYW5kbGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFDQSw4REFBcUM7QUFFckMsaUJBQVMsU0FBUyxlQUFlLENBQUMsT0FBeUM7SUFFekUsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3RDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLHVCQUF1QixFQUFFLENBQU8sR0FBRyxFQUFFLEdBQUcsRUFBRSxFQUFFO1FBQzdELElBQUk7WUFDRixNQUFNLGdCQUFnQixHQUFHLE1BQU0sT0FBTyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUNwRixHQUFHLENBQUMsV0FBVyxDQUFDLGtCQUFrQixDQUFDLENBQUM7WUFDcEMsSUFBSSxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsRUFBRTtnQkFDaEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3REO2lCQUFNO2dCQUNMLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ2hCLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEVBQUMsT0FBTyxFQUFFLGdDQUFnQyxFQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7YUFDNUY7U0FDRjtRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUM7U0FDbEQ7SUFDSCxDQUFDLENBQUEsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsK0NBQStDLEVBQUUsQ0FBTyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUU7UUFDckYsSUFBSTtZQUNGLE1BQU0sMEJBQTBCLEdBQUcsTUFBTSxPQUFPLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQztnQkFDakcsU0FBUyxFQUFFLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUztnQkFDL0IsRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFO2FBQ25CLENBQUMsQ0FBQztZQUNILEdBQUcsQ0FBQyxXQUFXLENBQUMsa0JBQWtCLENBQUMsQ0FBQztZQUNwQyxJQUFJLDBCQUEwQixDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUMxQyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzthQUMzRDtpQkFBTTtnQkFDTCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNoQixHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxFQUFDLE9BQU8sRUFBRSw0Q0FBNEMsRUFBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ3hHO1NBQ0Y7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDaEIsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2xEO0lBQ0gsQ0FBQyxDQUFBLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7UGx1Z2luQ29uZmlnLCBQbHVnaW5Sb3V0ZU9wdGlvbnN9IGZyb20gJy4uL0B0eXBlcy9wbHVnaW4nO1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAnYm9keS1wYXJzZXInO1xuXG5leHBvcnQgPSBmdW5jdGlvbiBjb25maWd1cmVSb3V0ZXMob3B0aW9uczogUGx1Z2luUm91dGVPcHRpb25zPFBsdWdpbkNvbmZpZz4pOiB2b2lkIHtcblxuICBvcHRpb25zLnJvdXRlci51c2UoYm9keVBhcnNlci5qc29uKCkpO1xuICBvcHRpb25zLnJvdXRlci5nZXQoJy9nZXRPZ21hQ29uZmlndXJhdGlvbicsIGFzeW5jIChyZXEsIHJlcykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBMS0VDb25maWd1cmF0aW9uID0gYXdhaXQgb3B0aW9ucy5nZXRSZXN0Q2xpZW50KHJlcSkuY29uZmlnLmdldENvbmZpZ3VyYXRpb24oKTtcbiAgICAgIHJlcy5jb250ZW50VHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgaWYgKExLRUNvbmZpZ3VyYXRpb24uaXNTdWNjZXNzKCkpIHtcbiAgICAgICAgcmVzLnN0YXR1cygyMDApO1xuICAgICAgICByZXMuc2VuZChKU09OLnN0cmluZ2lmeShMS0VDb25maWd1cmF0aW9uLmJvZHkub2dtYSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MTIpO1xuICAgICAgICByZXMuc2VuZChKU09OLnN0cmluZ2lmeSh7c3RhdHVzOiA0MTIsIGJvZHk6IHttZXNzYWdlOiAndGhlcmUgd2FzIGFuIGVycm9yIG9nbWEgY29uZmlnJ319KSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzLnN0YXR1cyg0MTIpO1xuICAgICAgcmVzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe3N0YXR1czogNDEyLCBib2R5OiBlfSkpO1xuICAgIH1cbiAgfSk7XG4gIG9wdGlvbnMucm91dGVyLmdldCgnL2dldFZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uLzppZCY6c291cmNlS2V5JywgYXN5bmMgKHJlcSwgcmVzKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uID0gYXdhaXQgb3B0aW9ucy5nZXRSZXN0Q2xpZW50KHJlcSkudmlzdWFsaXphdGlvbi5nZXRWaXN1YWxpemF0aW9uKHtcbiAgICAgICAgc291cmNlS2V5OiByZXEucGFyYW1zLnNvdXJjZUtleSxcbiAgICAgICAgaWQ6ICtyZXEucGFyYW1zLmlkXG4gICAgICB9KTtcbiAgICAgIHJlcy5jb250ZW50VHlwZSgnYXBwbGljYXRpb24vanNvbicpO1xuICAgICAgaWYgKHZpc3VhbGl6YXRpb25Db25maWd1cmF0aW9uLmlzU3VjY2VzcygpKSB7XG4gICAgICAgIHJlcy5zdGF0dXMoMjAwKTtcbiAgICAgICAgcmVzLnNlbmQoSlNPTi5zdHJpbmdpZnkodmlzdWFsaXphdGlvbkNvbmZpZ3VyYXRpb24uYm9keSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzLnN0YXR1cyg0MTIpO1xuICAgICAgICByZXMuc2VuZChKU09OLnN0cmluZ2lmeSh7c3RhdHVzOiA0MTIsIGJvZHk6IHttZXNzYWdlOiAndGhlcmUgd2FzIGFuIGVycm9yIGdldHR0aW5nIHRoZSB2aXogY29uZmlnJ319KSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmVzLnN0YXR1cyg0MTIpO1xuICAgICAgcmVzLnNlbmQoSlNPTi5zdHJpbmdpZnkoe3N0YXR1czogNDEyLCBib2R5OiBlfSkpO1xuICAgIH1cbiAgfSk7XG59O1xuIl19