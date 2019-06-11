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
const time_1 = require("../lib/time");
const antd_1 = require("antd");
const intervals = [
    [60 * 1000, 500],
    [60 * 60 * 1000, 30 * 1000],
    [60 * 60 * 24 * 1000, 60 * 1000 * 30],
    [Infinity, 60 * 60 * 24 * 1000]
];
class NiceElapsedTime extends React.Component {
    constructor(props) {
        super(props);
        this.nowTimer = null;
        this.state = {
            now: new Date()
        };
        this.interval = this.calcInterval();
    }
    calcInterval() {
        const elapsed = this.state.now.getTime() - this.props.time.getTime();
        for (const [upto, interval] of intervals) {
            if (elapsed < upto) {
                return interval;
            }
        }
        console.error('hmm again', elapsed, intervals);
        throw new Error('did not find interval');
    }
    handleInterval() {
        this.setState({ now: new Date() });
        const interval = this.calcInterval();
        if (this.interval !== interval) {
            this.interval = interval;
            this.startIntervalTimer();
        }
    }
    startIntervalTimer() {
        if (this.nowTimer) {
            window.clearInterval(this.nowTimer);
        }
        this.nowTimer = window.setInterval(() => {
            this.handleInterval();
        }, this.interval);
    }
    componentDidMount() {
        this.startIntervalTimer();
    }
    componentWillUnmount() {
        if (this.nowTimer) {
            window.clearInterval(this.nowTimer);
        }
    }
    render() {
        if (this.props.showTooltip === false) {
            return React.createElement("span", null, time_1.niceElapsed(this.props.time, { absoluteAfter: 30, now: this.state.now }));
        }
        const fullDate = (React.createElement("span", null, Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            timeZoneName: 'short'
        }).format(this.props.time)));
        let tooltip;
        if (this.props.tooltipPrefix) {
            tooltip = (React.createElement("span", null,
                this.props.tooltipPrefix,
                fullDate));
        }
        else {
            tooltip = fullDate;
        }
        return (React.createElement(antd_1.Tooltip, { placement: "bottomRight", title: tooltip }, time_1.niceElapsed(this.props.time, { absoluteAfter: 30, now: this.state.now })));
    }
}
exports.default = NiceElapsedTime;
//# sourceMappingURL=NiceElapsedTime.js.map