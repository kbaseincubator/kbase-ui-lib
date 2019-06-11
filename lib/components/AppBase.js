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
require("./AppBase.css");
const loader_1 = __importDefault(require("./integration/loader"));
const loader_2 = __importDefault(require("./auth/loader"));
require("antd/dist/antd.css");
require("typeface-oxygen");
class AppBase extends React.Component {
    constructor(props) {
        super(props);
        this.hosted = window.frameElement ? true : false;
        this.state = {
            clicks: 0
        };
    }
    clickMe() {
        this.setState({ clicks: this.state.clicks + 1 });
    }
    render() {
        return (React.createElement(loader_1.default, null,
            React.createElement(loader_2.default, { hosted: this.hosted },
                React.createElement("div", { className: "Row Row-fullheight Row-scrollable", "data-k-b-testhook-component": "AppBase" }, this.props.children))));
    }
}
exports.default = AppBase;
//# sourceMappingURL=AppBase.js.map