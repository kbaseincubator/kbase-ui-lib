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
const React = __importStar(require("react"));
const react_redux_1 = require("react-redux");
const actions_1 = require("../../redux/integration/actions");
const Loader_1 = __importDefault(require("../Loader"));
const container_1 = __importDefault(require("./container"));
class Wrapped extends React.Component {
    render() {
        return (React.createElement(Loader_1.default, { status: this.props.status, error: this.props.error, onLoad: this.props.onLoad },
            React.createElement(container_1.default, null, this.props.children)));
    }
}
function mapStateToProps(state, props) {
    const { app: { status } } = state;
    return {
        status
    };
}
exports.mapStateToProps = mapStateToProps;
function mapDispatchToProps(dispatch) {
    return {
        onLoad: () => {
            console.log('integration loading...');
            dispatch(actions_1.appStart());
        }
    };
}
exports.mapDispatchToProps = mapDispatchToProps;
exports.default = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(Wrapped);
//# sourceMappingURL=index.js.map