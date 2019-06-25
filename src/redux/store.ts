import { AppStoreState, makeIntegrationStoreInitialState } from './integration/store';
import { AuthStoreState, makeAuthStoreInitialState } from './auth/store';

export interface BaseStoreState extends AppStoreState, AuthStoreState {}

export function makeBaseStoreState(): BaseStoreState {
    const appStore = makeIntegrationStoreInitialState();
    const authStore = makeAuthStoreInitialState();
    return {
        ...appStore,
        ...authStore
    };
}

export interface AppError {
    code: string;
    message: string;
    generatedAt?: Date;
    trace?: Array<string>;
    errors?: Array<AppError>;
}
