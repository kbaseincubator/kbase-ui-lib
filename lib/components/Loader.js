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
const store_1 = require("../redux/integration/store");
class Loader extends React.Component {
    componentDidMount() {
        this.props.onLoad();
    }
    renderError() {
        if (!this.props.error) {
            return (React.createElement("div", { "data-k-b-testhook-component": "Loader", "data-k-b-testhook-element": "error" }, "An Unknown Error Occurred!"));
        }
        return (React.createElement("div", { "data-k-b-testhook-component": "Loader", "data-k-b-testhook-element": "error" }, this.props.error.message));
    }
    renderLoading() {
        return (React.createElement("div", { "data-k-b-testhook-component": "Loader", "data-k-b-testhook-element": "loading" }, "Loading..."));
    }
    render() {
        switch (this.props.status) {
            case store_1.AppState.NONE:
            case store_1.AppState.LOADING:
                return this.renderLoading();
            case store_1.AppState.ERROR:
                return this.renderError();
            case store_1.AppState.READY:
                return this.props.children;
        }
    }
}
exports.default = Loader;
//# sourceMappingURL=Loader.js.map