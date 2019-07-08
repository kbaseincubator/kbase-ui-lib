import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import * as Cookies from 'es-cookie';
import { AppError, BaseStoreState } from '../store';
import AuthClient from '../../lib/coreServices/auth';

export enum AuthActionType {
    AUTH_CHECK = 'auth check',
    AUTH_CHECK_START = 'auth check start',
    AUTH_CHECK_ERROR = 'auth check error',
    AUTH_AUTHORIZED = 'auth authorized',
    AUTH_UNAUTHORIZED = 'auth unauthorized',
    AUTH_REMOVE_AUTHORIZATION = 'auth remove authorization',
    AUTH_ADD_AUTHORIZATION = 'auth add authorization',
    AUTH_ADD_AUTHORIZATION_ERROR = 'auth add authorization error'
}

// Action Definitions

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

// Action Creators

export function authCheckStart(): AuthCheckStart {
    return {
        type: AuthActionType.AUTH_CHECK_START
    };
}

export function authCheckError(error: AppError): AuthCheckError {
    return {
        type: AuthActionType.AUTH_CHECK_ERROR,
        error
    };
}

export function authAuthorized(
    token: string,
    username: string,
    realname: string,
    roles: Array<string>
): AuthAuthorized {
    return {
        type: AuthActionType.AUTH_AUTHORIZED,
        token,
        username,
        realname,
        roles
    };
}

export function authUnauthorized(): AuthUnauthorized {
    return {
        type: AuthActionType.AUTH_UNAUTHORIZED
    };
}

// export function authRemoveAuthorization(): AuthRemoveAuthorization {
//     return {
//         type: ActionFlag.AUTH_REMOVE_AUTHORIZATION
//     }
// }

// export function authAddAuthorization(token: string): AuthAddAuthorization {
//     return {
//         type: ActionFlag.AUTH_ADD_AUTHORIZATION,
//         token: token
//     }
// }

// Action Thunks

export function checkAuth() {
    return (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        dispatch(authCheckStart());

        const {
            app: {
                config: {
                    services: {
                        Auth: { url }
                    }
                }
            }
        } = getState();

        // TODO: get the auth from the kbase-ui integration api, perhaps a postmessage call

        const token = Cookies.get('kbase_session');
        if (!token) {
            dispatch(authUnauthorized());
            return;
        }

        const auth = new AuthClient({ url: url });

        // Oh no, an orphan promise!
        Promise.all([auth.getTokenInfo(token), auth.getMe(token)])
            .then(([tokenInfo, account]) => {
                const roles = account.roles.map(({ id, desc }) => id);
                dispatch(authAuthorized(token, account.user, account.display, roles));
            })
            .catch((err) => {
                console.error('auth check error', err);
                dispatch(
                    authCheckError({
                        code: 'error',
                        message: err.message
                    })
                );
            });
    };
}

export function removeAuthorization() {
    return (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        // remove cookie
        Cookies.remove('kbase_session');

        // remove auth in state
        dispatch(authUnauthorized());
    };
}

export function addAuthorization(token: string) {
    return (dispatch: ThunkDispatch<BaseStoreState, void, Action>, getState: () => BaseStoreState) => {
        const {
            app: {
                config: {
                    services: {
                        Auth: { url }
                    }
                }
            }
        } = getState();

        // add cookie
        Cookies.set('kbase_session', token);

        // TODO: get auth info
        const auth = new AuthClient({ url: url });
        Promise.all([auth.getTokenInfo(token), auth.getMe(token)])
            .then(([tokenInfo, account]) => {
                const roles = account.roles.map(({ id, desc }) => id);
                dispatch(authAuthorized(token, account.user, account.display, roles));
            })
            .catch((err) => {
                console.error('auth check error', err);
                dispatch(
                    authCheckError({
                        code: 'error',
                        message: err.message
                    })
                );
            });
    };
}
