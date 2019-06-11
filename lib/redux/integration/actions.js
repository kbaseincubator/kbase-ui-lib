"use strict";
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
    ActionType["APP_SEND_MESSAGE"] = "app/sendMessage";
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
let channel;
function appStart() {
    return (dispatch, getState) => {
        let integration = new IFrameIntegration_1.IFrameIntegration();
        let iframeParams = integration.getParamsFromIFrame();
        if (iframeParams) {
            let channelId = iframeParams.channelId;
            channel = new windowChannel_1.Channel({
                to: channelId
            });
            channel.on('start', (params) => {
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
                    channelId
                }));
            }, (err) => {
                console.error('Error starting...', err);
            });
            channel.start();
            channel.send('ready', {
                channelId: channel.id,
                greeting: 'heloooo'
            });
        }
        else {
            iframeParams = new IFrameSimulator_1.default().getParamsFromIFrame();
            dispatch(appLoadSuccess({
                baseUrl: '',
                services: {
                    Groups: {
                        url: iframeParams.params.groupsServiceURL
                    },
                    UserProfile: {
                        url: iframeParams.params.userProfileServiceURL
                    },
                    Workspace: {
                        url: iframeParams.params.workspaceServiceURL
                    },
                    ServiceWizard: {
                        url: iframeParams.params.serviceWizardURL
                    },
                    Auth: {
                        url: iframeParams.params.authServiceURL
                    },
                    NarrativeMethodStore: {
                        url: iframeParams.params.narrativeMethodStoreURL
                    },
                    Catalog: {
                        url: iframeParams.params.catalogServiceURL
                    },
                    NarrativeJobService: {
                        url: iframeParams.params.narrativeJobServiceURL
                    }
                },
                defaultPath: '/'
            }, {
                channelId: null
            }));
        }
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