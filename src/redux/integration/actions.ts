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
    APP_SEND_MESSAGE = 'app/sendMessage'
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

let channel: Channel;

export function appStart() {
    return (dispatch: ThunkDispatch<AppStoreState, void, Action>, getState: () => AppStoreState) => {
        // check and see if we are in an iframe
        let integration = new IFrameIntegration();
        let iframeParams = integration.getParamsFromIFrame();
        console.log('got params?', iframeParams);

        if (iframeParams) {
            // set up the message bus.
            let channelId = iframeParams.channelId;

            channel = new Channel({
                to: channelId
            });

            // channel.on(
            //     'navigate',
            //     ({ to, params }) => {},
            //     (err) => {
            //         console.error('Error processing "navigate" message');
            //     }
            // );

            channel.on(
                'start',
                (params: any) => {
                    // console.log('start?', params);
                    // const urlBase = params.config.deploy.services.urlBase;
                    // const services = params.config.coreServices;
                    // const services = params.config.coreServices.reduce((services: any, service: any) => {
                    //     services[service.module] = service;
                    //     return services;
                    // }, {});
                    // console.log('dispatching...', services.NarrativeJobService);
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
                                channelId
                            }
                        )
                    );
                },
                (err: Error) => {
                    console.error('Error starting...', err);
                }
            );

            channel.start();

            channel.send('ready', {
                channelId: channel.id,
                greeting: 'heloooo'
            });

            // route from paths passed in from kbase-ui
            // switch (iframeParams.params.view) {
            //     case 'org':
            //         defaultPath = '/viewOrganization/' + iframeParams.params.viewParams.id;
            //         window.history.replaceState(null, 'test', defaultPath);
            //         break;
            //     default:
            //         defaultPath = '/organizations';
            //         window.history.replaceState(null, 'organizations', '/organizations');
            //         break;
            // }

            // suck up all the params into our state.
        } else {
            iframeParams = new IFrameSimulator().getParamsFromIFrame();
            dispatch(
                appLoadSuccess(
                    {
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
                    },
                    {
                        channelId: null
                    }
                )
            );
        }
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
