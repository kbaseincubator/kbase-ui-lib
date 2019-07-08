"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const windowChannel_1 = require("../../lib/windowChannel");
const IFrameIntegration_1 = require("../../lib/IFrameIntegration");
const actions_1 = require("../auth/actions");
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
        if (!channel) {
            console.warn('Trying to set title without a channel!');
            return;
        }
        dispatch(sendMessage('set-title', { title }));
    });
}
exports.appSetTitle = appSetTitle;
let channel;
let windowListener;
function appStart() {
    return (dispatch, getState) => {
        console.log('app start');
        let iframeParams = IFrameIntegration_1.getParamsFromDOM();
        console.log('[app start] iframe params', iframeParams);
        if (!iframeParams) {
            return;
        }
        const hostChannelId = iframeParams.channelId;
        const channel = new windowChannel_1.Channel({
            to: hostChannelId,
            debug: false
        });
        const devMode = false;
        channel.on('start', (params) => {
            console.log('starting (action)!', params);
            const services = params.config.services;
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
                devMode,
                title: ''
            }));
            if (params.authorization) {
                const { token, username, realname, roles } = params.authorization;
                dispatch(actions_1.authAuthorized(token, username, realname, roles));
            }
        }, (err) => {
            console.error('Error starting...', err);
        });
        channel.start();
        console.log('sending ready', channel.id);
        channel.send('ready', {
            channelId: channel.id,
            greeting: 'heloooo'
        });
        windowListener = () => {
            channel.send('clicked', {});
        };
        window.document.body.addEventListener('click', windowListener);
        console.log('integration app start action finished');
    };
}
exports.appStart = appStart;
function sendMessage(messageName, payload) {
    return (dispatch, getState) => {
        console.log('sending message?', messageName, payload);
        channel.send(messageName, payload);
    };
}
exports.sendMessage = sendMessage;
//# sourceMappingURL=actions.js.map