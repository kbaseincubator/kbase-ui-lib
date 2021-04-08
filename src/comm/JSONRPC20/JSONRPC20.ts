import { v4 as uuid } from 'uuid';
import { JSONArrayOf, JSONValue } from '../../json';

export interface JSONRPCRequestOptions {
    func: string,
    params: any,
    timeout?: number,
    token?: string;
}

// The entire JSON RPC request object
export interface JSONRPCRequest {
    method: string,
    jsonrpc: '2.0',
    id: string,
    params: Array<JSONValue>,
    context?: any;
}

export interface JSONRPCErrorInfo {
    code: string,
    status?: number,
    message: string,
    detail?: string;
    data?: any;
}

export interface JSONRPCClientParams {
    url: string,
    timeout: number;
    token?: string;
}

export interface JSONPayload {
    jsonrpc: string;
    method: string;
    id: string;
    params: Array<JSONValue>;
}

export interface JSONRPC20Error {
    name: string;
    code: number;
    message: string;
    error: JSONValue;
}

export type JSONRPCError = JSONRPC20Error;

export class JSONRPC20Exception extends Error {
    error: JSONRPC20Error;
    constructor(error: JSONRPCError) {
        super(error.message);
        this.error = error;
    }
}

export interface JSONRPCResponseResult {
    result: Array<JSONValue>;
    error: null;
}

export interface JSONRPCResponseError {
    result: null;
    error: JSONRPCError;
}

export type JSONRPCResponse = JSONRPCResponseResult | JSONRPCResponseError;

export class JSONRPCClient {
    url: string;
    timeout: number;
    token?: string;
    constructor({ url, timeout, token }: JSONRPCClientParams) {
        this.url = url;
        this.timeout = timeout;
        this.token = token;
    }

    protected makePayload(method: string, params: Array<JSONValue>): JSONPayload {
        return {
            jsonrpc: '2.0',
            method,
            id: uuid(),
            params
        };
    }

    async callMethod(method: string, params: Array<JSONValue>, { timeout }: { timeout?: number; } = {}): Promise<JSONArrayOf<JSONValue>> {
        const payload = this.makePayload(method, params);
        const headers = new Headers();
        headers.set('content-type', 'application/json');
        headers.set('accept', 'application/json');
        if (this.token) {
            headers.set('authorization', this.token);
        }

        // TODO: timeout, cancellation
        const response = await fetch(this.url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers
        });

        const result = await (async () => {
            const responseText = await response.text();

            try {
                return JSON.parse(responseText) as JSONArrayOf<JSONValue>;
            } catch (ex) {
                console.error('error', ex);
                throw new JSONRPC20Exception({
                    name: 'parse error',
                    code: 100,
                    message: 'The response from the service could not be parsed',
                    error: {
                        originalMessage: ex.message,
                        responseText
                    }
                });
            }
        })();

        if (result.hasOwnProperty('error')) {
            const errorResult = (result as unknown) as JSONRPCResponseError;
            throw new JSONRPC20Exception({
                name: errorResult.error.name,
                code: errorResult.error.code,
                message: errorResult.error.message,
                error: errorResult.error.error
            });
        }

        const rpcResponse = (result as unknown) as JSONRPCResponseResult;
        return rpcResponse.result;
    }
}
