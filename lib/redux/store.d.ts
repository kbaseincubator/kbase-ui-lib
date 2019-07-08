import { AppStoreState } from './integration/store';
import { AuthStoreState } from './auth/store';
import { DevelopStoreState } from './develop/store';
import { RootStoreState } from './root/store';
export interface BaseStoreState extends RootStoreState, AppStoreState, AuthStoreState, DevelopStoreState {
}
export declare function makeBaseStoreState(): BaseStoreState;
export interface AppError {
    code: string;
    message: string;
    generatedAt?: Date;
    trace?: Array<string>;
    errors?: Array<AppError>;
}
