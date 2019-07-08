"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const auth_1 = __importDefault(require("./coreServices/auth"));
var AuthState;
(function (AuthState) {
    AuthState[AuthState["NONE"] = 0] = "NONE";
    AuthState[AuthState["AUTHENTICATED"] = 1] = "AUTHENTICATED";
    AuthState[AuthState["UNAUTHENTICATED"] = 2] = "UNAUTHENTICATED";
    AuthState[AuthState["ERROR"] = 3] = "ERROR";
})(AuthState = exports.AuthState || (exports.AuthState = {}));
class Auth {
    constructor(url) {
        this.url = url;
    }
    checkAuth() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = Cookies.get('kbase_session');
            if (!token) {
                return Promise.resolve({
                    status: AuthState.UNAUTHENTICATED,
                    userAuthorization: null
                });
            }
            const auth = new auth_1.default({ url: this.url });
            return Promise.all([auth.getTokenInfo(token), auth.getMe(token)])
                .then(([tokenInfo, account]) => {
                const roles = account.roles.map(({ id, desc }) => id);
                return {
                    status: AuthState.AUTHENTICATED,
                    userAuthorization: {
                        token,
                        username: account.user,
                        realname: account.display,
                        roles
                    }
                };
            })
                .catch((err) => {
                return {
                    status: AuthState.UNAUTHENTICATED,
                    userAuthorization: null
                };
            });
        });
    }
}
exports.default = Auth;
//# sourceMappingURL=Auth.js.map