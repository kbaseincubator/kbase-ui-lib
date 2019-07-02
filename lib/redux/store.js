"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./integration/store");
const store_2 = require("./auth/store");
function makeBaseStoreState() {
    const appStore = store_1.makeIntegrationStoreInitialState();
    const authStore = store_2.makeAuthStoreInitialState();
    return Object.assign({}, appStore, authStore);
}
exports.makeBaseStoreState = makeBaseStoreState;
//# sourceMappingURL=store.js.map