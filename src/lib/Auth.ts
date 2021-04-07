import * as Cookies from 'es-cookie';
import AuthClient from './comm/coreServices/Auth';

export type Role = string;

export interface UserAuthentication {
    token: string;
    username: string;
    realname: string;
    roles: Array<Role>;
}

export enum AuthenticationStatus {
    NONE = 'NONE',
    CHECKING = 'CHECKING',
    AUTHENTICATED = 'AUTHENTICATED',
    UNAUTHENTICATED = 'UNAUTHENTICATED',
    ERROR = 'ERROR'
}

interface AuthenticationBase {
    status: AuthenticationStatus;
}

export interface AuthenticationNone extends AuthenticationBase {
    status: AuthenticationStatus.NONE;
}

export interface AuthenticationChecking extends AuthenticationBase {
    status: AuthenticationStatus.CHECKING
}

export interface AuthenticationAuthenticated extends AuthenticationBase {
    status: AuthenticationStatus.AUTHENTICATED,
    userAuthentication: UserAuthentication
}

export interface AuthenticationUnauthenticated extends AuthenticationBase {
    status: AuthenticationStatus.UNAUTHENTICATED
}

export interface AuthenticationError extends AuthenticationBase {
    status: AuthenticationStatus.ERROR,
    message: string
}

export type Authentication =
    AuthenticationNone |
    AuthenticationChecking |
    AuthenticationAuthenticated |
    AuthenticationUnauthenticated |
    AuthenticationError;

export default class Auth {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    async checkAuth(): Promise<Authentication> {
        const token = Cookies.get('kbase_session');
        if (!token) {
            return {
                status: AuthenticationStatus.UNAUTHENTICATED
            };
        }

        const auth = new AuthClient({ url: this.url });

        try {
            const account = await auth.getMe(token);
            const roles = account.roles.map(({ id, desc }) => id);
            return {
                status: AuthenticationStatus.AUTHENTICATED,
                userAuthentication: {
                    token,
                    username: account.user,
                    realname: account.display,
                    roles
                }
            };
        } catch (err) {
            return {
                status: AuthenticationStatus.ERROR,
                message: err.message
            };
        }
    }
}
