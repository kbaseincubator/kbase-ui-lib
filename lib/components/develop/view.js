"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
require("./style.css");
const antd_1 = require("antd");
const store_1 = require("../../redux/auth/store");
const store_2 = require("../../redux/develop/store");
function authStateLabel(status) {
    switch (status) {
        case store_1.AuthState.NONE:
            return 'none';
        case store_1.AuthState.CHECKING:
            return 'checking';
        case store_1.AuthState.AUTHORIZED:
            return 'authorized';
        case store_1.AuthState.UNAUTHORIZED:
            return 'unauthorized';
        case store_1.AuthState.ERROR:
            return 'error';
        default:
            return 'OTHER';
    }
}
class Develop extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.tokenRef = react_1.default.createRef();
    }
    componentDidMount() {
        this.props.start(window);
    }
    onLoginClick() {
        if (this.tokenRef.current === null) {
            return;
        }
        const token = this.tokenRef.current.value;
        if (token.length === 0) {
            return;
        }
        this.props.addAuthorization(token);
    }
    onLogoutClick() {
        this.props.removeAuthorization();
    }
    renderAuthForm() {
        return (react_1.default.createElement("div", { className: "Develop-auth-form" },
            react_1.default.createElement("p", null,
                react_1.default.createElement("b", null, "Not Authenticated!"),
                " Enter a Login Token below."),
            "Token: ",
            react_1.default.createElement("input", { ref: this.tokenRef, style: { width: '30em' } }),
            react_1.default.createElement(antd_1.Button, { icon: "login", htmlType: "submit", onClick: this.onLoginClick.bind(this) }, "Login")));
    }
    renderAuthToolbar() {
        if (!this.props.authorization.userAuthorization) {
            return;
        }
        return (react_1.default.createElement("div", { className: "Develop-auth-toolbar" },
            "Logged in as",
            ' ',
            react_1.default.createElement("b", null,
                react_1.default.createElement("span", null, this.props.authorization.userAuthorization.realname),
                " (",
                react_1.default.createElement("span", null, this.props.authorization.userAuthorization.username)),
            ")",
            ' ',
            react_1.default.createElement(antd_1.Button, { icon: "logout", onClick: this.onLogoutClick.bind(this) }, "Logout")));
    }
    renderAuth() {
        switch (this.props.authorization.status) {
            case store_1.AuthState.CHECKING:
                return react_1.default.createElement("div", null);
            case store_1.AuthState.AUTHORIZED:
                return react_1.default.createElement("div", { className: "Auth Auth-authorized scrollable-flex-column" }, this.renderAuthToolbar());
            case store_1.AuthState.NONE:
            case store_1.AuthState.UNAUTHORIZED:
                return react_1.default.createElement("div", { className: "Auth Auth-unauthorized scrollable-flex-column" }, this.renderAuthForm());
            case store_1.AuthState.ERROR:
                return (react_1.default.createElement("div", { className: "Auth Auth-unauthorized scrollable-flex-column" },
                    react_1.default.createElement("p", null, "Error"),
                    this.props.authorization.message));
            default:
                return react_1.default.createElement("div", null);
        }
    }
    renderDevError() {
        return react_1.default.createElement("div", null, "Dev Error");
    }
    renderDevReady() {
        const params = {
            channelId: this.props.hostChannelId
        };
        const paramsString = JSON.stringify(params);
        return (react_1.default.createElement("div", { "data-params": encodeURIComponent(paramsString), "data-plugin-host": "true" },
            react_1.default.createElement("div", { className: "Develop-area" },
                react_1.default.createElement(antd_1.Tag, null, "Develop Mode Area"),
                this.renderTitleToolbar(),
                this.renderAuth()),
            this.props.children));
    }
    renderDevLoading() {
        const message = (react_1.default.createElement("div", { className: "Develop-area" },
            react_1.default.createElement(antd_1.Spin, null),
            " Loading Dev Environment..."));
        return react_1.default.createElement(antd_1.Alert, { message: message });
    }
    renderDev() {
        switch (this.props.developStatus) {
            case store_2.DevelopStatus.NONE:
            case store_2.DevelopStatus.LOADING:
                return this.renderDevLoading();
            case store_2.DevelopStatus.ERROR:
                return this.renderDevError();
            case store_2.DevelopStatus.READY:
                return this.renderDevReady();
        }
    }
    renderTitleToolbar() {
        return (react_1.default.createElement("div", { className: "Develop-toolbar" },
            "Title: ",
            react_1.default.createElement("span", null, this.props.title)));
    }
    renderDebug() {
        return (react_1.default.createElement("div", { className: "Develop-debug" },
            "Development: dev status: ",
            this.props.developStatus,
            ", channel:",
            this.props.hostChannelId));
    }
    render() {
        return react_1.default.createElement(react_1.default.Fragment, null, this.renderDev());
    }
}
exports.default = Develop;
//# sourceMappingURL=view.js.map