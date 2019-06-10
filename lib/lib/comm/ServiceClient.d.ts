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
export declare class ServiceClient {
    url: string;
    token: string | null;
    timeout: number;
    static module: string;
    constructor({ url, token, timeout }: ServiceClientParams);
    makePayload(method: string, param: any): JSONPayload;
    makeEmptyPayload(method: string): JSONPayload;
}
export declare class AuthorizedServiceClient extends ServiceClient {
    token: string;
    constructor(params: ServiceClientParams);
    callFunc(func: string, param: any): Promise<JSONResponse>;
}
