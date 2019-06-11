"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AuthState;
(function (AuthState) {
    AuthState[AuthState["NONE"] = 0] = "NONE";
    AuthState[AuthState["CHECKING"] = 1] = "CHECKING";
    AuthState[AuthState["AUTHORIZED"] = 2] = "AUTHORIZED";
    AuthState[AuthState["UNAUTHORIZED"] = 3] = "UNAUTHORIZED";
    AuthState[AuthState["ERROR"] = 4] = "ERROR";
})(AuthState = exports.AuthState || (exports.AuthState = {}));
function makeAuthStoreInitialState() {
    return {
        auth: {
            status: AuthState.NONE,
            message: '',
            userAuthorization: null
        }
    };
}
exports.makeAuthStoreInitialState = makeAuthStoreInitialState;
//# sourceMappingURL=store.js.map