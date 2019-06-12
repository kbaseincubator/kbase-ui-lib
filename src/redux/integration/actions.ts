import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import IFrameSimulator from '../../lib/IFrameSimulator';
import { IFrameIntegration } from '../../lib/IFrameIntegration';
import { AppConfig, AppStoreState, AppRuntime } from './store';
import { AppError } from '../store';
import { Channel } from '../../lib/windowChannel';
import uuid = require('uuid');

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
let fakeIframe: IFrameSimulator;

export function appStart() {
    return (dispatch: ThunkDispatch<AppStoreState, void, Action>, getState: () => AppStoreState) => {
        // check and see if we are in an iframe
        const integration = new IFrameIntegration();
        let iframeParams = integration.getParamsFromIFrame();
        let channelId: string;

        if (iframeParams) {
            // set up the message bus.
            channelId = iframeParams.channelId;

            // channel.on(
            //     'navigate',
            //     ({ to, params }) => {},
            //     (err) => {
            //         console.error('Error processing "navigate" message');
            //     }
            // );

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
            channelId = uuid.v4();
            fakeIframe = new IFrameSimulator(channelId);
            iframeParams = fakeIframe.getParamsFromIFrame();
            console.log('going to create channel for fake iframe...', channelId, iframeParams);
            // dispatch(
            //     appLoadSuccess(
            //         {
            //             baseUrl: '',
            //             services: {
            //                 Groups: {
            //                     url: iframeParams.params.groupsServiceURL
            //                 },
            //                 UserProfile: {
            //                     url: iframeParams.params.userProfileServiceURL
            //                 },
            //                 Workspace: {
            //                     url: iframeParams.params.workspaceServiceURL
            //                 },
            //                 ServiceWizard: {
            //                     url: iframeParams.params.serviceWizardURL
            //                 },
            //                 Auth: {
            //                     url: iframeParams.params.authServiceURL
            //                 },
            //                 NarrativeMethodStore: {
            //                     url: iframeParams.params.narrativeMethodStoreURL
            //                 },
            //                 Catalog: {
            //                     url: iframeParams.params.catalogServiceURL
            //                 },
            //                 NarrativeJobService: {
            //                     url: iframeParams.params.narrativeJobServiceURL
            //                 }
            //             },
            //             defaultPath: '/'
            //         },
            //         {
            //             channelId: null
            //         }
            //     )
            // );
        }

        channel = new Channel({
            to: channelId
        });

        channel.on(
            'start',
            (params: any) => {
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
