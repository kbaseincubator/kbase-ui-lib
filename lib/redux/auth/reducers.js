"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const store_1 = require("./store");
const actions_1 = require("./actions");
function authCheckStart(state, action) {
    return Object.assign({}, state, { auth: {
            status: store_1.AuthState.CHECKING,
            message: '',
            userAuthorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        } });
}
exports.authCheckStart = authCheckStart;
function authCheckError(state, action) {
    return Object.assign({}, state, { auth: {
            status: store_1.AuthState.ERROR,
            message: action.error.message,
            userAuthorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        } });
}
exports.authCheckError = authCheckError;
function authAuthorized(state, action) {
    return Object.assign({}, state, { auth: {
            status: store_1.AuthState.AUTHORIZED,
            message: '',
            userAuthorization: {
                token: action.token,
                username: action.username,
                realname: action.realname,
                roles: action.roles
            }
        } });
}
exports.authAuthorized = authAuthorized;
function authUnauthorized(state, action) {
    return Object.assign({}, state, { auth: {
            status: store_1.AuthState.UNAUTHORIZED,
            message: '',
            userAuthorization: {
                token: '',
                username: '',
                realname: '',
                roles: []
            }
        } });
}
exports.authUnauthorized = authUnauthorized;
const reducer = (state, action) => {
    if (!state) {
        return state;
    }
    switch (action.type) {
        case actions_1.AuthActionType.AUTH_CHECK_START:
            return authCheckStart(state, action);
        case actions_1.AuthActionType.AUTH_AUTHORIZED:
            return authAuthorized(state, action);
        case actions_1.AuthActionType.AUTH_UNAUTHORIZED:
            return authUnauthorized(state, action);
        case actions_1.AuthActionType.AUTH_CHECK_ERROR:
            return authCheckError(state, action);
        default:
            return;
    }
};
exports.default = reducer;
//# sourceMappingURL=reducers.js.map