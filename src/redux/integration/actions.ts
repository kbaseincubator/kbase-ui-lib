import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppConfig, AppRuntime, Navigation } from './store';
import { AppError, BaseStoreState } from '../store';
import { Channel } from '../../lib/windowChannel';
import { getParamsFromDOM } from '../../lib/IFrameIntegration';
import { authAuthorized } from '../auth/actions';

// Action types

export enum ActionType {
    APP_LOAD = '@kbase-ui-lib/app/load',
    APP_LOAD_START = '@kbase-ui-lib/app/load/start',
    APP_LOAD_SUCCESS = '@kbase-ui-lib/app/load/success',
    APP_LOAD_ERROR = '@kbase-ui-lib/app/load/error',
    APP_SEND_MESSAGE = '@kbase-ui-lib/app/send/message',
    APP_SEND_TITLE = '@kbase-ui-lib/app/send/title',
    APP_SET_TITLE = '@kbase-ui-lib/app/set/title',
    APP_NAVIGATE = '@kbase-ui-lib/app/navigate'
}

// Action Definitions

// export interface AppStart extends Action {
//     type: ActionFlag.APP_START,

// }

export interface AppLoadSuccess extends Action {
    type: ActionType.APP_LOAD_SUCCESS;
    config: AppConfig;
    runtime: AppRuntime;
}

export interface AppLoadError extends Action {
    type: ActionType.APP_LOAD_ERROR;
    error: AppError;
}

export interface AppSendTitle extends Action<ActionType.APP_SEND_TITLE> {
    type: ActionType.APP_SEND_TITLE;
    title: string;
}

export interface AppSetTitle extends Action<ActionType.APP_SET_TITLE> {
    type: ActionType.APP_SET_TITLE;
    title: string;
}

export interface AppNavigate extends Action<ActionType.APP_NAVIGATE> {
    type: ActionType.APP_NAVIGATE,
    navigation: Navigation
}
// Action Creators

export function loadSuccess(config: AppConfig, runtime: AppRuntime): AppLoadSuccess {
    return {
        type: ActionType.APP_LOAD_SUCCESS,
        config,
        runtime
    };
}

export function loadError(error: AppError): AppLoadError {
    return {
        type: ActionType.APP_LOAD_ERROR,
        error
    };
}

export function sendTitle(title: string) {
    return async (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        if (!channel) {
            console.warn('Trying to set title without a channel!');
            return;
        }

        dispatch(sendMessage('set-title', { title }));
        dispatch(setTitle(title));
    };
}

export function setTitle(title: string): AppSetTitle {
    return {
        type: ActionType.APP_SET_TITLE,
        title
    };
}

export function navigate(navigation: Navigation) {
    // console.log('navigate action creator', navigation);
    return {
        type: ActionType.APP_NAVIGATE,
        navigation
    }
}

let channel: Channel;
let windowListener: any;

export function appStart() {
    return (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        // check and see if we are in an iframe
        let iframeParams = getParamsFromDOM();
        if (!iframeParams) {
            return;
        }

        // Here we establish our comm channel, based on postMessage.
        // If iframe params are detected, we are operating in an iframe which
        // also means inside kbase-ui. The iframe will have a data- attribute
        // containing the id of the channel already set up by the ui. We call
        // this the host channel.
        // Without the ui, most commonly in develop mode but also testing,
        // the host channel is set up by a "fake iframe" object, which simulates
        // the host environment.
        // if (iframeParams) {
        // set up the plugin message bus.

        const hostChannelId = iframeParams.channelId;
        channel = new Channel({
            to: hostChannelId,
            debug: false
        });
        const devMode = false;

        // } else {
        //     // Create and configure the plugin message bus.
        //     channel = new Channel({});
        //     const fakeIframe = new IFrameSimulator(channel.id);
        //     hostChannelId = fakeIframe.channel.id;
        //     channel.setPartner(hostChannelId);
        //     iframeParams = fakeIframe.getParamsFromIFrame();
        //     devMode = true;
        // }

        // A plugin will wait until receiving a 'start' message. The
        // start message contains enough data for most apps to start
        // going, including core service configuration and communication
        // settings.
        channel.on(
            'start',
            (params: any) => {
                try {
                    const services = params.config.services;
                    dispatch(
                        loadSuccess(
                            {
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
                            },
                            {
                                channelId: channel.id,
                                hostChannelId,
                                devMode,
                                title: '',
                                navigation: {
                                    view: params.view,
                                    params: params.params || {}
                                }   
                            }
                        )
                    );

                    if (params.authorization) {
                        const { token, username, realname, roles } = params.authorization;
                        dispatch(authAuthorized(token, username, realname, roles));
                    }
                } catch (ex) {
                    channel.send('start-error', {
                        message: ex.message
                    })
                }

                channel.send('started', {});
            },
            (err: Error) => {
                console.error('Error starting...', err);
            }
        );

        channel.on(
            'navigate',
            ({ to, params }) => {
                // console.log('navigation?', to, params);
                dispatch(navigate({view: to, params: params}));
            },
            (err) => {
                console.error('Error processing "navigate" message');
            }
        );

        channel.start();

        // The 'ready' message is sent by the plugin (via the integration component and
        // associated actions like this one) to the ui to indicate that the initial code is loaded
        // and it is ready for further instructions (which in all likelihood is the 'start'
        // message handled above.)
        channel.send('ready', {
            channelId: channel.id,
            greeting: 'heloooo'
        });

        // Here we propagate the click event to the parent window (or at least the host channel).
        windowListener = () => {
            channel.send('clicked', {});
        };
        window.document.body.addEventListener('click', windowListener);

        ('integration app start action finished');

        // dispatch(appStartSuccess(channelId));

        // channel.on('set-title', ({ title }) => {
        //     dispatch(appSetTitle(title));
        // });
    };
}

export interface SendMessage {
    type: ActionType.APP_SEND_MESSAGE;
    messageName: string;
    payload: object;
}

// export function sendMessage(id: string, payload: object) {
//     return {
//         type: ActionType.APP_SEND_MESSAGE,
//         id,
//         payload
//     };
// }

export function sendMessage(messageName: string, payload: object) {
    return (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        channel.send(messageName, payload);
    };
}
