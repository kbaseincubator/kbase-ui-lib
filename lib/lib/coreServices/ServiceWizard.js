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
const ServiceClient_1 = require("../comm/ServiceClient");
function isString(x, p) {
    if (typeof x === 'object' && Reflect.has(x, p)) {
        if (typeof Reflect.get(x, p) === 'string') {
            return true;
        }
    }
    return false;
}
function isNumber(x, p) {
    if (typeof x === 'object' && Reflect.has(x, p)) {
        if (typeof Reflect.get(x, p) === 'number') {
            return true;
        }
    }
    return false;
}
function isArray(x, p, subType) {
    if (typeof x === 'object' && Reflect.has(x, p)) {
        const value = Reflect.get(x, p);
        if (typeof value === 'object' && value instanceof Array) {
            if (value.length === 0) {
                return true;
            }
            return value.every((arrayElement) => {
                return typeof arrayElement === 'string';
            });
        }
    }
    return false;
}
function isGetServiceStatusResult(x) {
    if (isString(x, 'module_name') &&
        isString(x, 'version') &&
        isString(x, 'git_commit_hash') &&
        isArray(x, 'release_tags', 'string') &&
        isString(x, 'url') &&
        isNumber(x, 'up') &&
        isString(x, 'status') &&
        isString(x, 'health')) {
        return true;
    }
    return false;
}
class ServiceWizardClient extends ServiceClient_1.AuthorizedServiceClient {
    getServiceStatus(params) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.callFunc('get_service_status', params);
            if (result.result && result.result.length > 0) {
                const theResult = result.result[0];
                if (!theResult) {
                    throw new Error('Crazy at it seems, no result');
                }
                if (isGetServiceStatusResult(theResult)) {
                    return theResult;
                }
                else {
                    throw new Error('Sorry, not the expected type "GetServiceStatusResult"');
                }
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