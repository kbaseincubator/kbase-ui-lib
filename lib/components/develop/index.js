"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const view_1 = __importDefault(require("./view"));
const actions_1 = require("../../redux/develop/actions");
const actions_2 = require("../../redux/auth/actions");
function mapStateToProps(state, props) {
    const { root: { hostChannelId }, develop: { title, status: developStatus }, auth } = state;
    console.log('dev index', developStatus, hostChannelId);
    return {
        title,
        hostChannelId,
        authorization: auth,
        developStatus
    };
}
exports.mapStateToProps = mapStateToProps;
function mapDispatchToProps(dispatch) {
    return {
        start: (window) => {
            dispatch(actions_1.start(window));
        },
        addAuthorization: (token) => {
            dispatch(actions_2.addAuthorization(token));
        },
        removeAuthorization: () => {
            dispatch(actions_2.removeAuthorization());
        }
    };
}
exports.mapDispatchToProps = mapDispatchToProps;
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(view_1.default);
//# sourceMappingURL=index.js.map