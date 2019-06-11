import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { AppError, BaseStoreState } from '../store';
export declare enum AuthActionType {
    AUTH_CHECK = "auth check",
    AUTH_CHECK_START = "auth check start",
    AUTH_CHECK_ERROR = "auth check error",
    AUTH_AUTHORIZED = "auth authorized",
    AUTH_UNAUTHORIZED = "auth unauthorized",
    AUTH_REMOVE_AUTHORIZATION = "auth remove authorization",
    AUTH_ADD_AUTHORIZATION = "auth add authorization",
    AUTH_ADD_AUTHORIZATION_ERROR = "auth add authorization error"
}
export interface AuthCheck extends Action {
    type: AuthActionType.AUTH_CHECK;
}
export interface AuthCheckStart extends Action {
    type: AuthActionType.AUTH_CHECK_START;
}
export interface AuthCheckError extends Action {
    type: AuthActionType.AUTH_CHECK_ERROR;
    error: AppError;
}
export interface AuthAuthorized extends Action {
    type: AuthActionType.AUTH_AUTHORIZED;
    token: string;
    username: string;
    realname: string;
    roles: Array<string>;
}
export interface AuthUnauthorized extends Action {
    type: AuthActionType.AUTH_UNAUTHORIZED;
}
export interface AuthRemoveAuthorization extends Action {
    type: AuthActionType.AUTH_REMOVE_AUTHORIZATION;
}
export interface AuthAddAuthorization extends Action {
    type: AuthActionType.AUTH_ADD_AUTHORIZATION;
    token: string;
}
export declare function authCheckStart(): AuthCheckStart;
export declare function authCheckError(error: AppError): AuthCheckError;
export declare function authAuthorized(token: string, username: string, realname: string, roles: Array<string>): AuthAuthorized;
export declare function authUnauthorized(): AuthUnauthorized;
export declare function checkAuth(): (dispatch: ThunkDispatch<BaseStoreState, void, Action<any>>, getState: () => BaseStoreState) => void;
export declare function removeAuthorization(): (dispatch: ThunkDispatch<BaseStoreState, void, Action<any>>, getState: () => BaseStoreState) => void;
export declare function addAuthorization(token: string): (dispatch: ThunkDispatch<BaseStoreState, void, Action<any>>, getState: () => BaseStoreState) => void;
