import { AppStoreState } from './integration/store';
import { AuthStoreState } from './auth/store';

export interface BaseStoreState extends AppStoreState, AuthStoreState {}

export interface AppError {
    code: string;
    message: string;
    generatedAt?: Date;
    trace?: Array<string>;
    errors?: Array<AppError>;
}
