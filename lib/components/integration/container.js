"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const actions_1 = require("../../redux/integration/actions");
const view_1 = __importDefault(require("./view"));
function mapStateToProps(state, props) {
    const { app: { status, config: { defaultPath }, runtime: { title } }, root: { hostChannelId } } = state;
    return {
        defaultPath,
        hostChannelId,
        title
    };
}
exports.mapStateToProps = mapStateToProps;
function mapDispatchToProps(dispatch) {
    return {
        onAppStart: () => {
            dispatch(actions_1.appStart());
        }
    };
}
exports.mapDispatchToProps = mapDispatchToProps;
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(view_1.default);
//# sourceMappingURL=container.js.map