"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endpoints = {
    root: '',
    tokenInfo: 'api/V2/token',
    apiMe: 'api/V2/me',
    me: 'me',
    loginStart: 'login/start',
    logout: 'logout',
    loginChoice: 'login/choice',
    loginCreate: 'login/create',
    loginUsernameSuggest: 'login/suggestname',
    loginPick: 'login/pick',
    loginCancel: 'login/cancel',
    linkStart: 'link/start',
    linkCancel: 'link/cancel',
    linkChoice: 'link/choice',
    linkPick: 'link/pick',
    linkRemove: 'me/unlink',
    tokens: 'tokens',
    tokensRevoke: 'tokens/revoke',
    tokensRevokeAll: 'tokens/revokeall',
    userSearch: 'api/V2/users/search',
    adminUserSearch: 'api/V2/admin/search',
    adminUser: 'api/V2/admin/user'
};
class AuthClient {
    constructor({ url }) {
        this.url = url;
    }
    makePath(path) {
        if (typeof path === 'string') {
            return [this.url].concat([path]).join('/');
        }
        return [this.url].concat(path).join('/');
    }
    root() {
        return fetch(this.makePath([endpoints.root]), {
            headers: {
                Accept: 'application/json'
            },
            mode: 'cors'
        })
            .then((response) => {
            return response.json();
        })
            .then((result) => {
            return result;
        });
    }
    getTokenInfo(token) {
        return fetch(this.makePath([endpoints.tokenInfo]), {
            headers: {
                Accept: 'application/json',
                Authorization: token
            },
            mode: 'cors'
        })
            .then((response) => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
            .then((result) => {
            return result;
        });
    }
    getMe(token) {
        return fetch(this.makePath([endpoints.apiMe]), {
            headers: {
                Accept: 'application/json',
                Authorization: token
            },
            mode: 'cors'
        })
            .then((response) => {
            if (response.status !== 200) {
                throw new Error(response.statusText);
            }
            return response.json();
        })
            .then((result) => {
            return result;
        });
    }
}
exports.default = AuthClient;
//# sourceMappingURL=auth.js.map