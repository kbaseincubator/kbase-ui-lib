import { JSONArrayOf, JSONValue } from '../../json';
import { ServiceClient, ServiceClientParams } from './ServiceClient';

export type GenericClientParams = JSONArrayOf<JSONValue>;
export type GenericClientResult = JSONArrayOf<JSONValue>;

export interface GenericClientConstructorParams extends ServiceClientParams {
    module: string;
}

export default class GenericClient extends ServiceClient {
    module: string = '';

    constructor(params: GenericClientConstructorParams) {
        super(params);
        this.module = params.module;
    }

    public async callMethod(
        method: string,
        params: GenericClientParams
    ): Promise<GenericClientResult> {
        const result = await this.callFunc<GenericClientParams, GenericClientResult>(
            method,
            params
        );
        return result;
    }
}
