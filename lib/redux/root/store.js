"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RootState;
(function (RootState) {
    RootState[RootState["NONE"] = 0] = "NONE";
    RootState[RootState["HOSTED"] = 1] = "HOSTED";
    RootState[RootState["DEVELOP"] = 2] = "DEVELOP";
    RootState[RootState["ERROR"] = 3] = "ERROR";
})(RootState = exports.RootState || (exports.RootState = {}));
function makeRootStoreInitialState() {
    return {
        root: {
            hostChannelId: null,
            state: RootState.NONE
        }
    };
}
exports.makeRootStoreInitialState = makeRootStoreInitialState;
//# sourceMappingURL=store.js.map