import { Action } from 'redux';
import { Channel } from '../../lib/windowChannel';
import { BaseStoreState } from '../store';
import { ThunkDispatch } from 'redux-thunk';
import { AppConfig } from '../integration/store';
import Auth, { AuthState } from '../../lib/Auth';
import { sendMessage } from '../integration/actions';

export enum DevelopActionType {
    DEVELOP_SET_TITLE = 'develop/set/title',
    DEVELOP_START = 'develop/start',
    DEVELOP_LOAD_SUCCESS = 'develop/load/success'
}

export interface DevelopSetTitle extends Action<DevelopActionType.DEVELOP_SET_TITLE> {
    type: DevelopActionType.DEVELOP_SET_TITLE;
    title: string;
}

export interface DevelopStart extends Action<DevelopActionType.DEVELOP_START> {
    type: DevelopActionType.DEVELOP_START;
    window: Window;
}

export interface DevelopLoadSuccess extends Action<DevelopActionType.DEVELOP_LOAD_SUCCESS> {
    type: DevelopActionType.DEVELOP_LOAD_SUCCESS;
    hostChannelId: string;
}

export function setTitle(title: string): DevelopSetTitle {
    return {
        type: DevelopActionType.DEVELOP_SET_TITLE,
        title
    };
}

export function loadSuccess(hostChannelId: string): DevelopLoadSuccess {
    return {
        type: DevelopActionType.DEVELOP_LOAD_SUCCESS,
        hostChannelId
    };
}

let channel: Channel;

const devConfig: AppConfig = {
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

function setupAndStartChannel(channel: Channel, dispatch: ThunkDispatch<BaseStoreState, void, Action>) {
    channel.on('ready', async (params) => {
        channel.setPartner(params.channelId);

        // We get the initial auth info for this kbase session.
        const auth = new Auth(devConfig.services.Auth.url);
        const authInfo = await auth.checkAuth();

        if (authInfo.status === AuthState.AUTHENTICATED) {
            channel.send('start', {
                authorization: {
                    token: authInfo.userAuthorization!.token,
                    username: authInfo.userAuthorization!.username,
                    realname: authInfo.userAuthorization!.realname,
                    roles: authInfo.userAuthorization!.roles
                },
                config: devConfig,
                // TODO: refactor this to reflect the actual view and params in the dev tool.
                view: 'main',
                params: {
                    tab: 'user-jobs'
                }
            });
        } else {
            channel.send('start', {
                authorization: null,
                config: devConfig
            });
        }
    });

    channel.on('get-auth-status', async () => {
        const auth = new Auth(devConfig.services.Auth.url);
        const authInfo = await auth.checkAuth();
        if (authInfo.status === AuthState.AUTHENTICATED) {
            channel.send('auth-status', {
                token: authInfo.userAuthorization!.token,
                username: authInfo.userAuthorization!.username,
                realname: authInfo.userAuthorization!.realname,
                roles: authInfo.userAuthorization!.roles
            });
        } else {
            channel.send('auth-status', {
                token: null,
                username: '',
                realname: '',
                roles: []
            });
        }
    });

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
        // window.open(url, name);
    });

    // channel.on('set-plugin-params', ({ pluginParams }) => {
    //     if (Object.keys(pluginParams) === 0) {
    //         window.location.search = '';
    //         return;
    //     }
    //     const query = {};
    //     if (pluginParams.query) {
    //         query.query = pluginParams.query;
    //     }
    //     if (pluginParams.dataPrivacy && pluginParams.dataPrivacy.length > 0) {
    //         query.dataPrivacy = pluginParams.dataPrivacy.join(',');
    //     }
    //     if (pluginParams.workspaceTypes && pluginParams.workspaceTypes.length > 0) {
    //         query.workspaceTypes = pluginParams.workspaceTypes.join(',');
    //     }
    //     if (pluginParams.dataTypes) {
    //         query.dataTypes = pluginParams.dataTypes.join(',');
    //     }

    //     // prepare the params.
    //     const queryString = httpUtils.encodeQuery(query);

    //     const currentLocation = window.location.toString();
    //     const currentURL = new URL(currentLocation);
    //     currentURL.search = queryString;
    //     history.replaceState(null, '', currentURL.toString());
    // });

    // this.channel.on('send-instrumentation', (instrumentation) => {
    // });

    channel.on('ui-navigate', (to) => {
        console.warn('ui-navigate not yet supported');
    });

    channel.on('post-form', (config) => {
        console.warn('form-post not yet supported');
        // this.formPost(config);
    });

    channel.on('set-title', (config) => {
        dispatch(setTitle(config.title));
    });

    channel.start();
}

// export function start(channelId: string): DevelopStart {
//     return {
//         type: DevelopActionType.DEVELOP_START,
//         window
//     };
// }

export function start(window: Window) {
    return async (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        // create channel
        channel = new Channel({ debug: false });

        setupAndStartChannel(channel, dispatch);

        // set channel id via action
        dispatch(loadSuccess(channel.id));

        // set up channel handlers, etc.
    };
}
