import axios from 'axios';

export interface GenericClientParams {
    url: string;
    module: string;
    token?: string;
    timeout?: number;
}

const DEFAULT_TIMEOUT = 10000;

export interface JSONPayload<T> {
    version: string;
    method: string;
    id: string;
    params: T;
}

export interface JSONRPCError {
    name: string;
    code: number;
    message: string;
    error: string;
}

export interface MethodSuccessResult<T> {
    result: T;
    error: null;
}

export interface MethodErrorResult {
    result: null;
    error: JSONRPCError;
}

export type MethodResponse<T> = MethodSuccessResult<T> | MethodErrorResult;

export type JSONRPCResponse<T> =
    // success
    | [T, null, null]
    // success, but void result
    | [null, null, null]
    // error returned by method, not sdk wrapper
    | [null, MethodErrorResult, null]
    // error returned by sdk wrapper (caught exception)
    | [null, null, JSONRPCError];

export class JSONRPCException extends Error {
    name: string;
    code: number;
    // message: string
    error: string;
    constructor({ name, code, message, error }: JSONRPCError) {
        super(message);
        this.name = name;
        this.code = code;
        this.error = error;
    }
}

export class classJSONRPCServerException extends Error {
    // constructor(message: string) {
    //     super(message);
    // }
}

export class GenericClient {
    url: string;
    token: string | null;
    module: string;
    timeout?: number;

    constructor({ url, token, module, timeout }: GenericClientParams) {
        this.url = url;
        this.token = token || null;
        this.module = module;
        this.timeout = timeout || DEFAULT_TIMEOUT;
    }

    protected makePayload<T>(method: string, param: T): JSONPayload<T> {
        return {
            version: '1.1',
            method: this.module + '.' + method,
            id: String(Math.random()).slice(2),
            params: param
        };
    }

    // protected makeEmptyPayload<T>(method: string): JSONPayload<T> {
    //     const params: Array<T> = [];
    //     return {
    //         version: '1.1',
    //         method: this.module + '.' + method,
    //         id: String(Math.random()).slice(2),
    //         params
    //     };
    // }

    // protected async processResponse<T>(response: AxiosResponse): Promise<T> {
    //     if (response.status === 200) {
    //         const { result } = await response.json();
    //         return result as T;
    //     } else if (response.status === 204) {
    //         // The SDK has a weird edge case in which a method can specify no
    //         // result, which is translated to a 204 response and no content.
    //         // IMO it should return a valid json value, like null so we don't
    //         // have to work around it.
    //         // const result = null
    //         // result as unknown as T
    //         const result: unknown = null;
    //         return result as T;
    //     }
    //     if (response.status === 500) {
    //         if (response.headers.get('Content-Type') === 'application/json') {
    //             const { error } = await response.json();
    //             throw new JSONRPCException(error);
    //         } else {
    //             const text = await response.text();
    //             throw new classJSONRPCServerException(text);
    //         }
    //     }
    //     throw new Error('Unexpected response: ' + response.status + ', ' + response.statusText);
    // }

    // protected async callFunc<T>(func: string, param: any): Promise<T> {
    //     const headers = new Headers();
    //     headers.append('Content-Type', 'application/json');
    //     headers.append('Accept', 'application/json');
    //     if (this.token) {
    //         headers.append('Authorization', this.token);
    //     }
    //     const response = await axios.post(this.url, this.makePayload(func, param), {
    //         // mode: 'cors',
    //         // cache: 'no-store',
    //         headers
    //     });
    //     // The response may be a 200 success, a 200 with method error,
    //     // an sdk 500 error, an internal 500 server error,
    //     // or any other http error code.
    //     return response.data as T
    //     // return this.processResponse<T>(response);
    // }

    async callFunc<P, R>(func: string, param: P): Promise<R> {
        // axios headers are ... any
        const headers: any = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        if (this.token) {
            headers['Authorization'] = this.token;
        }
        const params = this.makePayload<P>(func, param);
        const response = await axios.post(this.url, params, {
            headers,
            timeout: this.timeout
        });
        return response.data.result as R;
    }
}

export interface AuthorizedGenericClientParams {
    url: string;
    module: string;
    token: string;
}

export class AuthorizedGenericClient extends GenericClient {
    token: string;

    constructor(params: AuthorizedGenericClientParams) {
        super(params);
        if (!params.token) {
            throw new Error('Authorized client requires token');
        }
        this.token = params.token;
    }

    async callFunc<P, R>(func: string, param: P): Promise<R> {
        const params = this.makePayload<P>(func, param);
        const headers: any = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': this.token,
        }
        const response = await axios.post(this.url, params, {
            headers,
            timeout: this.timeout
        });
        return response.data.result as R;
    }
}
