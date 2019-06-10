"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServiceClient_1 = require("./ServiceClient");
class ServiceWizardClient extends ServiceClient_1.AuthorizedServiceClient {
    getServiceStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.callFunc('get_service_status', params);
            if (result.result && result.result.length > 0) {
                const theResult = result.result[0];
                if (!theResult) {
                    throw new Error('Crazy at it seems, no result');
                }
                return theResult;
            }
            else {
                throw new Error('Crazy at it seems, no result');
            }
        });
    }
}
ServiceWizardClient.module = 'ServiceWizard';
exports.ServiceWizardClient = ServiceWizardClient;
//# sourceMappingURL=ServiceWizard.js.map