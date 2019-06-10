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
const GenericClient_1 = require("../comm/GenericClient");
class CatalogClient extends GenericClient_1.GenericClient {
    isAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.callFunc('is_admin', [null]);
            return result;
        });
    }
    getExecAggrTable(param) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.callFunc('get_exec_aggr_table', [param]);
            return result;
        });
    }
    getExecAggrStats(param) {
        return __awaiter(this, void 0, void 0, function* () {
            const [result] = yield this.callFunc('get_exec_aggr_stats', [param]);
            return result;
        });
    }
}
CatalogClient.module = 'Catalog';
exports.default = CatalogClient;
//# sourceMappingURL=Catalog.js.map