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
const NiceRelativeTime_1 = __importDefault(require("./NiceRelativeTime"));
enzyme_1.configure({ adapter: new enzyme_adapter_react_16_1.default() });
it('renders without crashing', () => {
    const channelId = null;
    enzyme_1.shallow(React.createElement(NiceRelativeTime_1.default, { time: new Date(Date.now() + 10000) }));
});
it('renders and unmounts correctly', () => {
    const channelId = null;
    const rendered = enzyme_1.mount(React.createElement(NiceRelativeTime_1.default, { time: new Date(Date.now() + 10000) }));
    rendered.unmount();
});
//# sourceMappingURL=NiceRelativeTime.test.js.map