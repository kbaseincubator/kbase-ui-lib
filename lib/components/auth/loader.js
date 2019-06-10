"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../redux/auth/actions");
const view_1 = __importDefault(require("./view"));
function mapStateToProps(state, props) {
    const { auth } = state;
    return {
        authorization: auth
    };
}
function mapDispatchToProps(dispatch) {
    return {
        checkAuth: () => {
            dispatch(actions_1.checkAuth());
        },
        onRemoveAuthorization: () => {
            dispatch(actions_1.removeAuthorization());
        },
        onAddAuthorization: (token) => {
            dispatch(actions_1.addAuthorization(token));
        }
    };
}
exports.mapDispatchToProps = mapDispatchToProps;
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(view_1.default);
//# sourceMappingURL=loader.js.map