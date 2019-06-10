// Auth state

export enum AuthState {
    NONE = 0,
    CHECKING,
    AUTHORIZED,
    UNAUTHORIZED,
    ERROR
}

export interface UserAuthorization {
    token: string;
    username: string;
    realname: string;
    roles: Array<string>;
}

export interface Authorization {
    status: AuthState;
    userAuthorization: UserAuthorization | null;
    message: string;
}

export interface AuthStoreState {
    auth: Authorization;
}

export function makeAuthStoreInitialState(): AuthStoreState {
    return {
        auth: {
            status: AuthState.NONE,
            message: '',
            userAuthorization: null
        }
    };
}
