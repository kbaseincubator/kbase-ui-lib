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
const button_1 = __importDefault(require("antd/lib/button"));
const store_1 = require("../../redux/auth/store");
require("./style.css");
class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.tokenRef = React.createRef();
    }
    componentDidMount() {
        this.props.checkAuth();
    }
    onLogoutClick() {
        this.props.onRemoveAuthorization();
    }
    onLoginClick() {
        if (this.tokenRef.current === null) {
            return;
        }
        const token = this.tokenRef.current.value;
        if (token.length === 0) {
            return;
        }
        this.props.onAddAuthorization(token);
    }
    buildAuthForm() {
        return (React.createElement("div", { className: "Auth-form" },
            "Token: ",
            React.createElement("input", { ref: this.tokenRef, style: { width: '30em' } }),
            React.createElement(button_1.default, { icon: "save", htmlType: "submit", onClick: this.onLoginClick.bind(this) }, "Assign Token")));
    }
    buildAuthToolbar() {
        if (!this.props.authorization.userAuthorization) {
            return;
        }
        return (React.createElement("div", { className: "Auth-toolbar" },
            "Logged in as",
            ' ',
            React.createElement("b", null,
                React.createElement("span", null, this.props.authorization.userAuthorization.realname),
                " (",
                React.createElement("span", null, this.props.authorization.userAuthorization.username)),
            ") ",
            React.createElement(button_1.default, { icon: "logout", onClick: this.onLogoutClick.bind(this) })));
    }
    buildAuthDev() {
        switch (this.props.authorization.status) {
            case store_1.AuthState.NONE:
            case store_1.AuthState.CHECKING:
                return React.createElement("div", null);
            case store_1.AuthState.AUTHORIZED:
                return (React.createElement("div", { className: "Auth Auth-authorized scrollable-flex-column" },
                    this.buildAuthToolbar(),
                    this.props.children));
            case store_1.AuthState.UNAUTHORIZED:
                return (React.createElement("div", { className: "Auth Auth-unauthorized scrollable-flex-column" },
                    React.createElement("p", null, "Not authorized! Enter a user token below"),
                    this.buildAuthForm()));
            case store_1.AuthState.ERROR:
                return (React.createElement("div", { className: "Auth Auth-unauthorized scrollable-flex-column" },
                    React.createElement("p", null, "Error"),
                    this.props.authorization.message));
            default:
                return React.createElement("div", null);
        }
    }
    buildAuthProd() {
        switch (this.props.authorization.status) {
            case store_1.AuthState.NONE:
            case store_1.AuthState.CHECKING:
                return React.createElement("div", null);
            case store_1.AuthState.AUTHORIZED:
                return React.createElement("div", { className: "Auth Auth-authorized scrollable-flex-column" }, this.props.children);
            case store_1.AuthState.UNAUTHORIZED:
                return (React.createElement("div", { className: "Auth Auth-unauthorized scrollable-flex-column" },
                    React.createElement("p", null, "Not authorized!")));
            case store_1.AuthState.ERROR:
                return (React.createElement("div", { className: "Auth Auth-error scrollable-flex-column" },
                    React.createElement("p", null, "Error: ??")));
            default:
                return React.createElement("div", null);
        }
    }
    render() {
        return (React.createElement("div", { className: "Auth scrollable-flex-column" }, this.props.hosted ? this.buildAuthProd() : this.buildAuthDev()));
    }
}
exports.default = Auth;
//# sourceMappingURL=view.js.map