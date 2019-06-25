"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./style.css");
class DevWrapper extends react_1.default.Component {
    renderNonDev() {
        return react_1.default.createElement(react_1.default.Fragment, null, this.props.children);
    }
    renderDev() {
        return react_1.default.createElement("div", { className: "DevWrapper" }, this.props.children);
    }
    render() {
        return this.renderDev();
    }
}
exports.DevWrapper = DevWrapper;
//# sourceMappingURL=index.js.map