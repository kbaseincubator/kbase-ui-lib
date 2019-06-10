"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class JSONRPCException extends Error {
    constructor({ name, code, message, error }) {
        super(message);
        this.name = name;
        this.code = code;
        this.error = error;
    }
}
exports.JSONRPCException = JSONRPCException;
class classJSONRPCServerException extends Error {
}
exports.classJSONRPCServerException = classJSONRPCServerException;
class GenericClient {
    constructor({ url, token, module }) {
        this.url = url;
        this.token = token || null;
        this.module = module;
    }
    makePayload(method, param) {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: param
        };
    }
    makeEmptyPayload(method) {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        };
    }
    processResponse(response) {
        return __awaiter(this, void 0, void 0, function* () {
            if (response.status === 200) {
                const { result } = yield response.json();
                return result;
            }
            else if (response.status === 204) {
                const result = null;
                return result;
            }
            if (response.status === 500) {
                if (response.headers.get('Content-Type') === 'application/json') {
                    const { error } = yield response.json();
                    throw new JSONRPCException(error);
                }
                else {
                    const text = yield response.text();
                    throw new classJSONRPCServerException(text);
                }
            }
            throw new Error('Unexpected response: ' + response.status + ', ' + response.statusText);
        });
    }
    callFunc(func, param) {
        return __awaiter(this, void 0, void 0, function* () {
            const headers = new Headers();
            headers.append('Content-Type', 'application/json');
            headers.append('Accept', 'application/json');
            if (this.token) {
                headers.append('Authorization', this.token);
            }
            const response = yield fetch(this.url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-store',
                headers,
                body: JSON.stringify(this.makePayload(func, param))
            });
            return this.processResponse(response);
        });
    }
}
exports.GenericClient = GenericClient;
class AuthorizedGenericClient extends GenericClient {
    constructor(params) {
        super(params);
        if (!params.token) {
            throw new Error('Authorized client requires token');
        }
        this.token = params.token;
    }
    callFunc(func, param) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield fetch(this.url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-store',
                headers: {
                    Authorization: this.token,
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify(this.makePayload(func, param))
            });
            return this.processResponse(response);
        });
    }
}
exports.AuthorizedGenericClient = AuthorizedGenericClient;
//# sourceMappingURL=GenericClient.js.map