"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./integration/store");
const store_2 = require("./auth/store");
const store_3 = require("./develop/store");
const store_4 = require("./root/store");
function makeBaseStoreState() {
    const rootStore = store_4.makeRootStoreInitialState();
    const appStore = store_1.makeIntegrationStoreInitialState();
    const authStore = store_2.makeAuthStoreInitialState();
    const developStore = store_3.makeDevelopStore();
    return Object.assign({}, rootStore, appStore, authStore, developStore);
}
exports.makeBaseStoreState = makeBaseStoreState;
//# sourceMappingURL=store.js.map