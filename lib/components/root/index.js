"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const view_1 = __importDefault(require("./view"));
const actions_1 = require("../../redux/root/actions");
function mapStateToProps(state, props) {
    const { root: { state: rootState } } = state;
    return {
        rootState
    };
}
exports.mapStateToProps = mapStateToProps;
function mapDispatchToProps(dispatch) {
    return {
        startHostedEnvironment: (params) => {
            dispatch(actions_1.startHostedEnvironment(params));
        },
        startDevelopmentEnvironment: () => {
            dispatch(actions_1.startDevelopmentEnvironment());
        }
    };
}
exports.mapDispatchToProps = mapDispatchToProps;
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(view_1.default);
//# sourceMappingURL=index.js.map