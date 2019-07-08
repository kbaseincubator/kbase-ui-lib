"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const view_1 = __importDefault(require("./view"));
const store_1 = require("../../redux/auth/store");
function mapStateToProps(state, props) {
    const { auth: { status, userAuthorization } } = state;
    let token;
    let isAuthorized = false;
    switch (status) {
        case store_1.AuthState.NONE:
        case store_1.AuthState.CHECKING:
            token = null;
            break;
        case store_1.AuthState.AUTHORIZED:
            token = userAuthorization.token;
            isAuthorized = true;
            break;
        case store_1.AuthState.UNAUTHORIZED:
        case store_1.AuthState.ERROR:
            token = null;
            break;
        default:
            token = null;
    }
    return {
        token,
        authState: status,
        isAuthorized
    };
}
function mapDispatchToProps(dispatch, ownProps) {
    return {};
}
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(view_1.default);
//# sourceMappingURL=index.js.map