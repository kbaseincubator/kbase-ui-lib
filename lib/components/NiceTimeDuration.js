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
const antd_1 = require("antd");
const time_1 = require("../lib/time");
class NiceTimeDuration extends React.Component {
    render() {
        if (this.props.showTooltip === false) {
            return React.createElement("span", null, time_1.niceDuration(this.props.duration, {}));
        }
        const fullElapsed = React.createElement("span", null, time_1.niceDuration(this.props.duration, {}));
        let tooltip;
        if (this.props.tooltipPrefix) {
            tooltip = (React.createElement("span", null,
                this.props.tooltipPrefix,
                fullElapsed));
        }
        else {
            tooltip = fullElapsed;
        }
        return (React.createElement(antd_1.Tooltip, { placement: "bottomRight", title: tooltip }, time_1.niceDuration(this.props.duration, { precision: this.props.precision })));
    }
}
exports.default = NiceTimeDuration;
//# sourceMappingURL=NiceTimeDuration.js.map