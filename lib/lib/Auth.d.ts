export declare type Role = string;
export interface UserAuthorization {
    token: string;
    username: string;
    realname: string;
    roles: Array<Role>;
}
export declare enum AuthState {
    NONE = 0,
    AUTHENTICATED = 1,
    UNAUTHENTICATED = 2,
    ERROR = 3
}
export interface AuthInfo {
    status: AuthState;
    userAuthorization: UserAuthorization | null;
}
export default class Auth {
    url: string;
    constructor(url: string);
    checkAuth(): Promise<AuthInfo>;
}
