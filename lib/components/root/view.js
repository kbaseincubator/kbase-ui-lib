"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const IFrameIntegration_1 = require("../../lib/IFrameIntegration");
const store_1 = require("../../redux/root/store");
const Develop_1 = __importDefault(require("../Develop"));
function rootStateToLabel(state) {
    switch (state) {
        case store_1.RootState.NONE:
            return 'none';
        case store_1.RootState.HOSTED:
            return 'hosted';
        case store_1.RootState.DEVELOP:
            return 'develop';
        case store_1.RootState.ERROR:
            return 'error';
    }
}
class Root extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.iframeParams = IFrameIntegration_1.getParamsFromIFrame();
    }
    componentDidMount() {
        if (this.iframeParams) {
            this.props.startHostedEnvironment(this.iframeParams);
        }
        else {
            this.props.startDevelopmentEnvironment();
        }
    }
    renderDebug() {
        const status = rootStateToLabel(this.props.rootState);
        return react_1.default.createElement("div", null,
            "Root State: ",
            status,
            ", ");
    }
    render() {
        switch (this.props.rootState) {
            case store_1.RootState.NONE:
                return react_1.default.createElement("div", null, "Loading...");
            case store_1.RootState.HOSTED:
                return react_1.default.createElement(react_1.default.Fragment, null, this.props.children);
            case store_1.RootState.DEVELOP:
                return react_1.default.createElement(Develop_1.default, null, this.props.children);
            case store_1.RootState.ERROR:
                return react_1.default.createElement("div", null, "Error!");
        }
    }
}
exports.default = Root;
//# sourceMappingURL=view.js.map