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
const enzyme_1 = require("enzyme");
const enzyme_adapter_react_16_1 = __importDefault(require("enzyme-adapter-react-16"));
const Loader_1 = __importDefault(require("./Loader"));
const store_1 = require("../redux/integration/store");
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
it('renders without crashing', () => {
    const appState = store_1.AppState.NONE;
    const onLoad = () => {
        return;
    };
    enzyme_1.shallow(React.createElement(Loader_1.default, { status: appState, onLoad: onLoad }));
});
it('renders a loading ui when app state is NONE', () => {
    const appState = store_1.AppState.NONE;
    const onLoad = () => {
        return;
    };
    const rendered = enzyme_1.shallow(React.createElement(Loader_1.default, { status: appState, onLoad: onLoad }));
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="loading"]').length).toEqual(1);
});
it('renders a loading ui when app state is LOADING', () => {
    const appState = store_1.AppState.LOADING;
    const onLoad = () => {
        return;
    };
    const rendered = enzyme_1.shallow(React.createElement(Loader_1.default, { status: appState, onLoad: onLoad }));
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="loading"]').length).toEqual(1);
});
it('renders a loading ui when app state is ERROR', () => {
    const appState = store_1.AppState.ERROR;
    const onLoad = () => {
        return;
    };
    const error = {
        message: 'my bad',
        code: 'my-bad'
    };
    const rendered = enzyme_1.shallow(React.createElement(Loader_1.default, { status: appState, error: error, onLoad: onLoad }));
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="error"]').length).toEqual(1);
});
it('renders a loading ui when app state is ERROR but there is no message', () => {
    const appState = store_1.AppState.ERROR;
    const onLoad = () => {
        return;
    };
    const rendered = enzyme_1.shallow(React.createElement(Loader_1.default, { status: appState, onLoad: onLoad }));
    expect(rendered.find('[data-k-b-testhook-component="Loader"][data-k-b-testhook-element="error"]').length).toEqual(1);
});
it('renders a loading ui when app state is READY', () => {
    const appState = store_1.AppState.READY;
    const onLoad = () => {
        return;
    };
    const TestComponent = () => {
        return React.createElement("div", { "data-k-b-testhook-component": "TestComponent" });
    };
    const rendered = enzyme_1.mount(React.createElement(Loader_1.default, { status: appState, onLoad: onLoad },
        React.createElement(TestComponent, null)));
    expect(rendered.find('[data-k-b-testhook-component="TestComponent"]').length).toEqual(1);
});
//# sourceMappingURL=Loader.test.js.map