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
const view_1 = __importDefault(require("./view"));
const store_1 = require("../../redux/auth/store");
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
it('renders without crashing', () => {
    const authorization = {
        status: store_1.AuthState.NONE,
        message: '',
        userAuthorization: {
            token: '',
            username: '',
            realname: '',
            roles: []
        }
    };
    const checkAuth = () => { };
    const onRemoveAuthorization = () => { };
    const onAddAuthorization = (token) => { };
    const hosted = false;
    const wrapper = enzyme_1.shallow(React.createElement(view_1.default, { authorization: authorization, hosted: hosted, checkAuth: checkAuth, onRemoveAuthorization: onRemoveAuthorization, onAddAuthorization: onAddAuthorization }));
});
//# sourceMappingURL=unit.test.js.map