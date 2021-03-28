import * as Cookies from 'es-cookie';
import AuthClient from './comm/coreServices/Auth';

export type Role = string;

export interface UserAuthorization {
    token: string;
    username: string;
    realname: string;
    roles: Array<Role>;
}

export enum AuthState {
    NONE = 0,
    AUTHENTICATED,
    UNAUTHENTICATED,
    ERROR
}

export interface AuthInfo {
    status: AuthState;
    userAuthorization: UserAuthorization | null;
}

export default class Auth {
    url: string;
    constructor(url: string) {
        this.url = url;
    }

    async checkAuth(): Promise<AuthInfo> {
        const token = Cookies.get('kbase_session');
        if (!token) {
            return Promise.resolve({
                status: AuthState.UNAUTHENTICATED,
                userAuthorization: null
            });
        }

        const auth = new AuthClient({ url: this.url });

        // Oh no, an orphan promise!
        return Promise.all([auth.getTokenInfo(token), auth.getMe(token)])
            .then(([tokenInfo, account]) => {
                const roles = account.roles.map(({ id, desc }) => id);
                return {
                    status: AuthState.AUTHENTICATED,
                    userAuthorization: {
                        token,
                        username: account.user,
                        realname: account.display,
                        roles
                    }
                };
            })
            .catch((err) => {
                return {
                    status: AuthState.UNAUTHENTICATED,
                    userAuthorization: null
                };
            });
    }
}
