import { AppError } from '../store';

// App State

export enum AppState {
    NONE = 0,
    LOADING,
    READY,
    ERROR
}

export interface AppConfig {
    baseUrl: string;
    services: {
        Groups: {
            url: string;
        };
        UserProfile: {
            url: string;
        };
        Workspace: {
            url: string;
        };
        ServiceWizard: {
            url: string;
        };
        Auth: {
            url: string;
        };
        NarrativeMethodStore: {
            url: string;
        };
        Catalog: {
            url: string;
        };
        NarrativeJobService: {
            url: string;
        };
    };
    defaultPath: string;
}

export interface AppRuntime {
    channelId: string | null;
    hostChannelId: string | null;
    devMode: boolean | null;
    title: string;
}

export interface AppStoreState {
    app: {
        status: AppState;
        config: AppConfig;
        runtime: AppRuntime;
        error?: AppError;
    };
}

export function makeIntegrationStoreInitialState(): AppStoreState {
    return {
        app: {
            status: AppState.NONE,
            config: {
                baseUrl: '',
                services: {
                    Groups: {
                        url: ''
                    },
                    UserProfile: {
                        url: ''
                    },
                    Workspace: {
                        url: ''
                    },
                    ServiceWizard: {
                        url: ''
                    },
                    Auth: {
                        url: ''
                    },
                    NarrativeMethodStore: {
                        url: ''
                    },
                    Catalog: {
                        url: ''
                    },
                    NarrativeJobService: {
                        url: ''
                    }
                },
                defaultPath: ''
            },
            runtime: {
                channelId: null,
                hostChannelId: null,
                devMode: null,
                title: ''
            }
        }
    };
}
