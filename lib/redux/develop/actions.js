"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const windowChannel_1 = require("../../lib/windowChannel");
const Auth_1 = __importStar(require("../../lib/Auth"));
var DevelopActionType;
(function (DevelopActionType) {
    DevelopActionType["DEVELOP_SET_TITLE"] = "develop/set/title";
    DevelopActionType["DEVELOP_START"] = "develop/start";
    DevelopActionType["DEVELOP_LOAD_SUCCESS"] = "develop/load/success";
})(DevelopActionType = exports.DevelopActionType || (exports.DevelopActionType = {}));
function setTitle(title) {
    return {
        type: DevelopActionType.DEVELOP_SET_TITLE,
        title
    };
}
exports.setTitle = setTitle;
function loadSuccess(hostChannelId) {
    return {
        type: DevelopActionType.DEVELOP_LOAD_SUCCESS,
        hostChannelId
    };
}
exports.loadSuccess = loadSuccess;
let channel;
const devConfig = {
    baseUrl: '',
    defaultPath: '',
    services: {
        Groups: {
            url: '/services/groups'
        },
        UserProfile: {
            url: '/services/user_profile/rpc'
        },
        Workspace: {
            url: '/services/ws'
        },
        ServiceWizard: {
            url: '/services/service_wizard'
        },
        Auth: {
            url: '/services/auth'
        },
        NarrativeMethodStore: {
            url: '/services/narrative_method_store/rpc'
        },
        Catalog: {
            url: '/services/catalog/rpc'
        },
        NarrativeJobService: {
            url: '/services/njs_wrapper'
        }
    }
};
function setupAndStartChannel(channel, dispatch) {
    channel.on('ready', (params) => __awaiter(this, void 0, void 0, function* () {
        channel.setPartner(params.channelId);
        const auth = new Auth_1.default(devConfig.services.Auth.url);
        const authInfo = yield auth.checkAuth();
        console.log('auth info?', authInfo);
        if (authInfo.status === Auth_1.AuthState.AUTHENTICATED) {
            console.log('auth!!!', authInfo);
            channel.send('start', {
                authorization: {
                    token: authInfo.userAuthorization.token,
                    username: authInfo.userAuthorization.username,
                    realname: authInfo.userAuthorization.realname,
                    roles: authInfo.userAuthorization.roles
                },
                config: devConfig
            });
        }
        else {
            channel.send('start', {
                authorization: null,
                config: devConfig
            });
        }
    }));
    channel.on('get-auth-status', () => __awaiter(this, void 0, void 0, function* () {
        const auth = new Auth_1.default(devConfig.services.Auth.url);
        const authInfo = yield auth.checkAuth();
        if (authInfo.status === Auth_1.AuthState.AUTHENTICATED) {
            channel.send('auth-status', {
                token: authInfo.userAuthorization.token,
                username: authInfo.userAuthorization.username,
                realname: authInfo.userAuthorization.realname,
                roles: authInfo.userAuthorization.roles
            });
        }
        else {
            channel.send('auth-status', {
                token: null,
                username: '',
                realname: '',
                roles: []
            });
        }
    }));
    channel.on('get-config', () => {
        channel.send('config', {
            value: devConfig
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
    channel.on('set-title', (config) => {
        dispatch(setTitle(config.title));
    });
    channel.start();
}
function start(window) {
    return (dispatch, getState) => __awaiter(this, void 0, void 0, function* () {
        channel = new windowChannel_1.Channel({ debug: false });
        setupAndStartChannel(channel, dispatch);
        console.log('about to dispatch load success for develop wrapper...', channel.id);
        dispatch(loadSuccess(channel.id));
    });
}
exports.start = start;
//# sourceMappingURL=actions.js.map