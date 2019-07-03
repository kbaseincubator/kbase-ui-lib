import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import IFrameSimulator from '../../lib/IFrameSimulator';
import { IFrameIntegration } from '../../lib/IFrameIntegration';
import { AppConfig, AppStoreState, AppRuntime } from './store';
import { AppError } from '../store';
import { Channel } from '../../lib/windowChannel';

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
    return async (dispatch: ThunkDispatch<AppStoreState, void, Action>, getState: () => AppStoreState) => {
      const {
        app: {
          runtime: { channelId, hostChannelId }
        }
      } = getState();
  
    //   if (!channelId) {
    //     console.warn("Trying to set title without a channel!");
    //     return;
    //   }

    //   if (!hostChannelId) {
    //     console.warn("Trying to set title without a host channel!");
    //     return;
    //   }

      if (!channel) {
        console.warn("Trying to set title without a channel!");
        return;
      }

      console.log('setting app title by sending message to channel with id ', channelId);
    //   const channel = new Channel({ id: channelId, to: hostChannelId });
      channel.send("set-title", {
        title
      });
    };
  }

let channel: Channel;
let windowListener: any;

export function appStart() {
    return (dispatch: ThunkDispatch<AppStoreState, void, Action>, getState: () => AppStoreState) => {
        // check and see if we are in an iframe
        const integration = new IFrameIntegration();
        let iframeParams = integration.getParamsFromIFrame();
        let hostChannelId: string;

        // Here we establish our comm channel, based on postMessage.
        // If iframe params are detected, we are operating in an iframe which
        // also means inside kbase-ui. The iframe will have a data- attribute 
        // containing the id of the channel already set up by the ui. We call 
        // this the host channel.
        // Without the ui, most commonly in develop mode but also testing, 
        // the host channel is set up by a "fake iframe" object, which simulates
        // the host environment.
        if (iframeParams) {
            // set up the plugin message bus.
            hostChannelId = iframeParams.channelId;
            channel = new Channel({
                to: hostChannelId
            });
        } else {
            // Create and configure the plugin message bus.
            channel = new Channel({});
            const fakeIframe = new IFrameSimulator(channel.id);
            hostChannelId = fakeIframe.channel.id;
            channel.setPartner(hostChannelId);
            iframeParams = fakeIframe.getParamsFromIFrame();
        }

        // A plugin will wait until receiving a 'start' message. The 
        // start message contains enough data for most apps to start
        // going, including core service configuration and communication 
        // settings.
        channel.on(
            'start',
            (params: any) => {
                const services = params.config.services;
                console.log('starting (action)!', services);
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
                            title: ''
                        }
                    )
                );
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
        channel.send('ready', {
            channelId: channel.id,
            greeting: 'heloooo'
        });

        windowListener = () => {
            console.log('inside iframe: clicked window in iframe');
            channel.send('clicked', {});
        };

        window.document.body.addEventListener('click', windowListener);

        // channel.on('set-title', ({ title }) => {
        //     console.log('setting title?', title);
        //     dispatch(appSetTitle(title));
        // });
    };
}

export interface SendMessage {
    type: ActionType.APP_SEND_MESSAGE;
    id: string;
    payload: object;
}

// export function sendMessage(id: string, payload: object) {
//     return {
//         type: ActionType.APP_SEND_MESSAGE,
//         id,
//         payload
//     };
// }

export function sendMessage(id: string, payload: object) {
    return (dispatch: ThunkDispatch<AppStoreState, void, Action>, getState: () => AppStoreState) => {
        channel.send(id, payload);
    };
}
