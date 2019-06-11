import { AppError } from '../store';
export declare enum AppState {
    NONE = 0,
    LOADING = 1,
    READY = 2,
    ERROR = 3
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
}
export interface AppStoreState {
    app: {
        status: AppState;
        config: AppConfig;
        runtime: AppRuntime;
        error?: AppError;
    };
}
export declare function makeIntegrationStoreInitialState(): AppStoreState;
