import { AppStoreState } from './integration/store';
import { AuthStoreState } from './auth/store';
export interface BaseStoreState extends AppStoreState, AuthStoreState {
}
export declare function makeBaseStoreState(): BaseStoreState;
export interface AppError {
    code: string;
    message: string;
    generatedAt?: Date;
    trace?: Array<string>;
    errors?: Array<AppError>;
}
