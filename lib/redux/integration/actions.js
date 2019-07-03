"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const IFrameSimulator_1 = __importDefault(require("../../lib/IFrameSimulator"));
const IFrameIntegration_1 = require("../../lib/IFrameIntegration");
const windowChannel_1 = require("../../lib/windowChannel");
var ActionType;
(function (ActionType) {
    ActionType["APP_LOAD"] = "app load";
    ActionType["APP_LOAD_START"] = "app load start";
    ActionType["APP_LOAD_SUCCESS"] = "app load success";
    ActionType["APP_LOAD_ERROR"] = "app load error";
    ActionType["APP_SEND_MESSAGE"] = "app/send/message";
    ActionType["APP_SET_TITLE"] = "app/set/title";
})(ActionType = exports.ActionType || (exports.ActionType = {}));
function appLoadSuccess(config, runtime) {
    return {
        type: ActionType.APP_LOAD_SUCCESS,
        config,
        runtime
    };
}
exports.appLoadSuccess = appLoadSuccess;
function appLoadError(error) {
    return {
        type: ActionType.APP_LOAD_ERROR,
        error
    };
}
exports.appLoadError = appLoadError;
function appSetTitle(title) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        const { app: { runtime: { channelId, hostChannelId } } } = getState();
        if (!channelId) {
            console.warn("Trying to set title without a channel!");
            return;
        }
        if (!hostChannelId) {
            console.warn("Trying to set title without a host channel!");
            return;
        }
        console.log('setting app title by sending message to channel with id ', channelId);
        const channel = new windowChannel_1.Channel({ id: channelId, to: hostChannelId });
        channel.send("set-title", {
            title
        });
    });
}
exports.appSetTitle = appSetTitle;
let channel;
let fakeIframe;
let windowListener;
function appStart() {
    return (dispatch, getState) => {
        const integration = new IFrameIntegration_1.IFrameIntegration();
        let iframeParams = integration.getParamsFromIFrame();
        let hostChannelId;
        if (iframeParams) {
            hostChannelId = iframeParams.channelId;
            channel = new windowChannel_1.Channel({
                to: hostChannelId
            });
        }
        else {
            channel = new windowChannel_1.Channel({});
            fakeIframe = new IFrameSimulator_1.default(channel.id);
            hostChannelId = fakeIframe.channel.id;
            channel.setPartner(hostChannelId);
            iframeParams = fakeIframe.getParamsFromIFrame();
        }
        channel.on('start', (params) => {
            const services = params.config.services;
            console.log('starting (action)!', services);
            dispatch(appLoadSuccess({
                baseUrl: '',
                services: {
                    Groups: {
                        url: services.Groups.url
                    },
                    UserProfile: {
                        url: services.UserProfile.url
                    },
                    Workspace: {
                        url: services.Workspace.url
                    },
                    ServiceWizard: {
                        url: services.ServiceWizard.url
                    },
                    Auth: {
                        url: services.Auth.url
                    },
                    NarrativeMethodStore: {
                        url: services.NarrativeMethodStore.url
                    },
                    Catalog: {
                        url: services.Catalog.url
                    },
                    NarrativeJobService: {
                        url: services.NarrativeJobService.url
                    }
                },
                defaultPath: '/'
            }, {
                channelId: channel.id,
                hostChannelId,
                title: ''
            }));
        }, (err) => {
            console.error('Error starting...', err);
        });
        channel.start();
        channel.send('ready', {
            channelId: channel.id,
            greeting: 'heloooo'
        });
        windowListener = () => {
            console.log('inside iframe: clicked window in iframe');
            channel.send('clicked', {});
        };
        window.document.body.addEventListener('click', windowListener);
    };
}
exports.appStart = appStart;
function sendMessage(id, payload) {
    return (dispatch, getState) => {
        channel.send(id, payload);
    };
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=actions.js.map