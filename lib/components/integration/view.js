"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
require("./style.css");
class KBaseIntegration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ready: false
        };
        this.channel = null;
    }
    teardownChannel() { }
    componentDidMount() {
        console.log('integration did mount');
        this.setState({
            ready: true
        });
    }
    componentWillUnmount() {
        this.teardownChannel();
    }
    renderReady() {
        return React.createElement(React.Fragment, null, this.props.children);
    }
    renderNotReady() {
        return React.createElement("div", { "data-k-b-testhook-element": "notready" }, "Loading...");
    }
    render() {
        return (React.createElement("div", { "data-k-b-testhook-component": "KBaseIntegration", className: "scrollable-flex-column" }, this.state.ready ? this.renderReady() : this.renderNotReady()));
    }
}
exports.default = KBaseIntegration;
//# sourceMappingURL=view.js.map