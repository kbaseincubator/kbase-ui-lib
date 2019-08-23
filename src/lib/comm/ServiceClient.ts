/**
 * Provides an abstract service client and authorized service client which can be used as the
 * basis for a core service client utilizing the jsonrpc model.
 */

/**
 * Base structure for the service client constructor.
 *
 */
export interface ServiceClientParams {
    url: string;
    token?: string;
    timeout: number;
}

export interface JSONPayload {
    version: string;
    method: string;
    id: string;
    params: any;
}

export interface JSONResponse {
    id: string;
    version: string;
    result: any;
    error: any;
}

export abstract class ServiceClient<T extends ServiceClientParams> {
    url: string;
    token: string | null;
    timeout: number;

    static module: string;

    constructor({ url, token, timeout }: T) {
        this.url = url;
        this.token = token || null;
        this.timeout = timeout;
    }

    makePayload(method: string, param: any): JSONPayload {
        return {
            version: '1.1',
            method: (this.constructor as typeof ServiceClient).module + '.' + method,
            id: String(Math.random()).slice(2),
            params: [param]
        };
    }

    makeEmptyPayload(method: string): JSONPayload {
        return {
            version: '1.1',
            method: (this.constructor as typeof ServiceClient).module + '.' + method,
            id: String(Math.random()).slice(2),
            params: []
        };
    }
}

export interface AuthorizedServiceClientConstructorParams extends ServiceClientParams {
    token: string;
}

export abstract class AuthorizedServiceClient<T extends AuthorizedServiceClientConstructorParams> extends ServiceClient<
    T
> {
    token: string;

    constructor(params: T) {
        super(params);
        if (!params.token) {
            throw new Error('Authorized client requires token');
        }
        this.token = params.token;
    }

    protected callFunc(func: string, param: any): Promise<JSONResponse> {
        return new Promise((resolve, reject) => {
            const abortController = new AbortController();

            const connection = fetch(this.url, {
                method: 'POST',
                mode: 'cors',
                cache: 'no-store',
                headers: {
                    Authorization: this.token!,
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
                resolve((response.json() as unknown) as JSONResponse);
            });
        });
    }
}
