"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Cookies = __importStar(require("es-cookie"));
const auth_1 = __importDefault(require("../../lib/coreServices/auth"));
var AuthActionType;
(function (AuthActionType) {
    AuthActionType["AUTH_CHECK"] = "auth check";
    AuthActionType["AUTH_CHECK_START"] = "auth check start";
    AuthActionType["AUTH_CHECK_ERROR"] = "auth check error";
    AuthActionType["AUTH_AUTHORIZED"] = "auth authorized";
    AuthActionType["AUTH_UNAUTHORIZED"] = "auth unauthorized";
    AuthActionType["AUTH_REMOVE_AUTHORIZATION"] = "auth remove authorization";
    AuthActionType["AUTH_ADD_AUTHORIZATION"] = "auth add authorization";
    AuthActionType["AUTH_ADD_AUTHORIZATION_ERROR"] = "auth add authorization error";
})(AuthActionType = exports.AuthActionType || (exports.AuthActionType = {}));
function authCheckStart() {
    return {
        type: AuthActionType.AUTH_CHECK_START
    };
}
exports.authCheckStart = authCheckStart;
function authCheckError(error) {
    return {
        type: AuthActionType.AUTH_CHECK_ERROR,
        error
    };
}
exports.authCheckError = authCheckError;
function authAuthorized(token, username, realname, roles) {
    return {
        type: AuthActionType.AUTH_AUTHORIZED,
        token,
        username,
        realname,
        roles
    };
}
exports.authAuthorized = authAuthorized;
function authUnauthorized() {
    return {
        type: AuthActionType.AUTH_UNAUTHORIZED
    };
}
exports.authUnauthorized = authUnauthorized;
function checkAuth() {
    return (dispatch, getState) => {
        dispatch(authCheckStart());
        const { app: { config: { services: { Auth: { url } } } } } = getState();
        const token = Cookies.get('kbase_session');
        if (!token) {
            dispatch(authUnauthorized());
            return;
        }
        const auth = new auth_1.default({ url: url });
        Promise.all([auth.getTokenInfo(token), auth.getMe(token)])
            .then(([tokenInfo, account]) => {
            const roles = account.roles.map(({ id, desc }) => id);
            dispatch(authAuthorized(token, account.user, account.display, roles));
        })
            .catch((err) => {
            console.error('auth check error', err);
            dispatch(authCheckError({
                code: 'error',
                message: err.message
            }));
        });
    };
}
exports.checkAuth = checkAuth;
function removeAuthorization() {
    return (dispatch, getState) => {
        Cookies.remove('kbase_session');
        dispatch(authUnauthorized());
    };
}
exports.removeAuthorization = removeAuthorization;
function addAuthorization(token) {
    return (dispatch, getState) => {
        const { app: { config: { services: { Auth: { url } } } } } = getState();
        Cookies.set('kbase_session', token);
        const auth = new auth_1.default({ url: url });
        Promise.all([auth.getTokenInfo(token), auth.getMe(token)])
            .then(([tokenInfo, account]) => {
            const roles = account.roles.map(({ id, desc }) => id);
            dispatch(authAuthorized(token, account.user, account.display, roles));
        })
            .catch((err) => {
            console.error('auth check error', err);
            dispatch(authCheckError({
                code: 'error',
                message: err.message
            }));
        });
    };
}
exports.addAuthorization = addAuthorization;
//# sourceMappingURL=actions.js.map