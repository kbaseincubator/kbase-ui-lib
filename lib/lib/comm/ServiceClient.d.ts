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
export declare abstract class ServiceClient<T extends ServiceClientParams> {
    url: string;
    token: string | null;
    timeout: number;
    static module: string;
    constructor({ url, token, timeout }: T);
    makePayload(method: string, param: any): JSONPayload;
    makeEmptyPayload(method: string): JSONPayload;
}
export interface AuthorizedServiceClientConstructorParams extends ServiceClientParams {
    token: string;
}
export declare abstract class AuthorizedServiceClient<T extends AuthorizedServiceClientConstructorParams> extends ServiceClient<T> {
    token: string;
    constructor(params: T);
    callFunc(func: string, param: any): Promise<JSONResponse>;
}
