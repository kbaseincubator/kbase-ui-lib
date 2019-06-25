"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const windowChannel_1 = require("../../lib/windowChannel");
const uuid_1 = __importDefault(require("uuid"));
class Runtime {
    constructor() {
        this.token = 'abc';
        this.username = 'eapearson';
    }
    getAuthToken() {
        return this.token;
    }
    getUsername() {
        return this.username;
    }
    getConfig() {
        return {};
    }
}
class IFrame extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.id = 'frame_' + uuid_1.default.v4();
        this.tempChannelID = uuid_1.default.v4();
        this.partnerChannelID = null;
        this.channel = null;
        this.iframeRef = react_1.default.createRef();
        this.runtime = new Runtime();
    }
    componentDidMount() {
        if (this.iframeRef.current === null) {
            console.error('IFrame not found!');
            return;
        }
        if (this.iframeRef.current.contentWindow === null) {
            console.error('IFrame has no content window!');
            return;
        }
        this.channel = new windowChannel_1.Channel({
            to: this.tempChannelID,
            window: this.iframeRef.current.contentWindow
        });
        this.setupAndStartChannel(this.channel);
    }
    setupAndStartChannel(channel) {
        channel.on('ready', (params) => {
            console.log('READY!', params);
        });
        channel.on('get-auth-status', () => {
            channel.send('auth-status', {
                token: this.runtime.getAuthToken(),
                username: this.runtime.getUsername()
            });
        });
        channel.on('get-config', () => {
            channel.send('config', {
                value: this.runtime.getConfig()
            });
        });
        channel.on('add-button', ({ button }) => {
            console.warn('add button not yet supported');
        });
        channel.on('open-window', ({ url }) => {
            window.location.href = url;
        });
        channel.on('ui-navigate', (to) => {
            console.warn('ui-navigate not yet supported');
        });
        channel.on('post-form', (config) => {
            console.warn('form-post not yet supported');
        });
        channel.on('clicked', () => {
            window.document.body.click();
        });
        channel.on('set-title', (config) => {
            console.warn('set-title not yet supported');
        });
    }
    render() {
        const params = encodeURIComponent(JSON.stringify({
            frameId: this.id,
            parentHost: document.location.origin,
            params: this.props.params,
            channelId: this.tempChannelID
        }));
        const indexPath = this.props.pathRoot + '/iframe_root/index.html';
        const url = document.location.origin + '/' + indexPath;
        console.log('url is', url);
        return (react_1.default.createElement("div", { className: "IFrame" },
            react_1.default.createElement("iframe", { ref: this.iframeRef, id: this.id, title: this.id, name: this.id, "data-k-b-testhook-iframe": "plugin-iframe", "data-params": params, frameBorder: "0", scrolling: "no" }, this.props.children)));
    }
}
exports.default = IFrame;
//# sourceMappingURL=IFrame.js.map