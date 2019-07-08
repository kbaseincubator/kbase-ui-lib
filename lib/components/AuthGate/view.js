"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./style.css");
const antd_1 = require("antd");
class AuthGate extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.required = props.required;
    }
    renderUnauthorized() {
        const message = 'Not authorized - authentication required';
        return react_1.default.createElement(antd_1.Alert, { type: "error", message: message });
    }
    render() {
        if (!this.props.isAuthorized) {
            return this.renderUnauthorized();
        }
        return react_1.default.createElement(react_1.default.Fragment, null, this.props.children);
    }
}
exports.default = AuthGate;
//# sourceMappingURL=view.js.map