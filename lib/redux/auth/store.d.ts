export declare enum AuthState {
    NONE = 0,
    CHECKING = 1,
    AUTHORIZED = 2,
    UNAUTHORIZED = 3,
    ERROR = 4
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
export declare function makeAuthStoreInitialState(): AuthStoreState;
