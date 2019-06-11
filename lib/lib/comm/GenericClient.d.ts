export interface GenericClientParams {
    url: string;
    module: string;
    token?: string;
}
export interface JSONPayload {
    version: string;
    method: string;
    id: string;
    params: any;
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
export declare type MethodResponse<T> = MethodSuccessResult<T> | MethodErrorResult;
export declare type JSONRPCResponse<T> = [T, null, null] | [null, null, null] | [null, MethodErrorResult, null] | [null, null, JSONRPCError];
export declare class JSONRPCException extends Error {
    name: string;
    code: number;
    error: string;
    constructor({ name, code, message, error }: JSONRPCError);
}
export declare class classJSONRPCServerException extends Error {
}
export declare class GenericClient {
    url: string;
    token: string | null;
    module: string;
    constructor({ url, token, module }: GenericClientParams);
    makePayload(method: string, param: any): JSONPayload;
    makeEmptyPayload(method: string): JSONPayload;
    processResponse<T>(response: Response): Promise<T>;
    callFunc<T>(func: string, param: any): Promise<T>;
}
export interface AuthorizedGenericClientParams {
    url: string;
    module: string;
    token: string;
}
export declare class AuthorizedGenericClient extends GenericClient {
    token: string;
    constructor(params: AuthorizedGenericClientParams);
    callFunc<T>(func: string, param: any): Promise<T>;
}
