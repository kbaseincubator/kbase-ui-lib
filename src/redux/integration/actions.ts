import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { AppConfig, AppRuntime } from './store';
import { AppError, BaseStoreState } from '../store';
import { Channel } from '../../lib/windowChannel';
import { getParamsFromDOM } from '../../lib/IFrameIntegration';
import { authAuthorized } from '../auth/actions';

// Action types

export enum ActionType {
    APP_LOAD = 'app load',
    APP_LOAD_START = 'app load start',
    APP_LOAD_SUCCESS = 'app load success',
    APP_LOAD_ERROR = 'app load error',
    APP_SEND_MESSAGE = 'app/send/message',
    APP_SET_TITLE = 'app/set/title'
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

export interface AppSetTitle extends Action<ActionType.APP_SET_TITLE> {
    type: ActionType.APP_SET_TITLE;
    title: string;
}

// Action Creators

export function appLoadSuccess(config: AppConfig, runtime: AppRuntime): AppLoadSuccess {
    return {
        type: ActionType.APP_LOAD_SUCCESS,
        config,
        runtime
    };
}

export function appLoadError(error: AppError): AppLoadError {
    return {
        type: ActionType.APP_LOAD_ERROR,
        error
    };
}

export function appSetTitle(title: string) {
    return async (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        // const {
        //     root: { hostChannelId }
        //     // app: {
        //     //     runtime: { hostChannelId }
        //     // }
        // } = getState();

        //   if (!channelId) {
        //     console.warn("Trying to set title without a channel!");
        //     return;
        //   }

        //   if (!hostChannelId) {
        //     console.warn("Trying to set title without a host channel!");
        //     return;
        //   }

        if (!channel) {
            console.warn('Trying to set title without a channel!');
            return;
        }

        // console.log('setting app title by sending message to channel with id ', hostChannelId);
        //   const channel = new Channel({ id: channelId, to: hostChannelId });
        dispatch(sendMessage('set-title', { title }));
        //   channel.send("set-title", {
        //     title
        //   });
    };
}

let channel: Channel;
let windowListener: any;

export function appStart() {
    return (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        console.log('app start');
        // check and see if we are in an iframe
        let iframeParams = getParamsFromDOM();
        console.log('[app start] iframe params', iframeParams);
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
        const channel = new Channel({
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

        // console.log('where are we?', iframeParams);

        // A plugin will wait until receiving a 'start' message. The
        // start message contains enough data for most apps to start
        // going, including core service configuration and communication
        // settings.
        channel.on(
            'start',
            (params: any) => {
                console.log('starting (action)!', params);
                const services = params.config.services;

                dispatch(
                    appLoadSuccess(
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
                            title: ''
                        }
                    )
                );

                if (params.authorization) {
                    const { token, username, realname, roles } = params.authorization;
                    dispatch(authAuthorized(token, username, realname, roles));
                }
            },
            (err: Error) => {
                console.error('Error starting...', err);
            }
        );

        // channel.on(
        //     'navigate',
        //     ({ to, params }) => {},
        //     (err) => {
        //         console.error('Error processing "navigate" message');
        //     }
        // );

        channel.start();

        // The 'ready' message is sent by the plugin (via the integration component and
        // associated actions like this one) to the ui to indicate that the initial code is loaded
        // and it is ready for further instructions (which in all likelihood is the 'start'
        // message handled above.)
        console.log('sending ready', channel.id);
        channel.send('ready', {
            channelId: channel.id,
            greeting: 'heloooo'
        });

        // Here we propagate the click event to the parent window (or at least the host channel).
        windowListener = () => {
            channel.send('clicked', {});
        };
        window.document.body.addEventListener('click', windowListener);

        console.log('integration app start action finished');

        // dispatch(appStartSuccess(channelId));

        // channel.on('set-title', ({ title }) => {
        //     console.log('setting title?', title);
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
        console.log('sending message?', messageName, payload);
        channel.send(messageName, payload);
    };
}
