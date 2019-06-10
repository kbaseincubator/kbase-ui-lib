"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServiceClient {
    constructor({ url, token, timeout }) {
        this.url = url;
        this.token = token || null;
        this.timeout = timeout;
    }
    makePayload(method, param) {
        return {
            version: '1.1',
            method: this.constructor.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: [param]
        };
    }
    makeEmptyPayload(method) {
        return {
            version: '1.1',
            method: this.constructor.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        };
    }
}
exports.ServiceClient = ServiceClient;
class AuthorizedServiceClient extends ServiceClient {
    constructor(params) {
        super(params);
        if (!params.token) {
            throw new Error('Authorized client requires token');
        }
        this.token = params.token;
    }
    callFunc(func, param) {
        return new Promise((resolve, reject) => {
            const abortController = new AbortController();
            const connection = fetch(this.url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-store',
                headers: {
                    Authorization: this.token,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                signal: abortController.signal,
                body: JSON.stringify(this.makePayload(func, param))
            });
            const startTime = Date.now();
            const timeoutTimer = window.setTimeout(() => {
                const elapsed = Date.now() - startTime;
                abortController.abort();
                reject(new Error(`Method call aborted due to timeout after ${elapsed} ms`));
            }, this.timeout);
            return connection.then((response) => {
                window.clearTimeout(timeoutTimer);
                if (response.status !== 200) {
                    throw new Error('Request error: ' + response.status + ', ' + response.statusText);
                }
                resolve(response.json());
            });
        });
    }
}
exports.AuthorizedServiceClient = AuthorizedServiceClient;
//# sourceMappingURL=ServiceClient.js.map