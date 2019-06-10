import Bluebird from 'bluebird';
export interface CacheParams {
    itemLifetime: number;
    monitoringFrequency: number;
    waiterTimeout: number;
    waiterFrequency: number;
}
export interface CacheItem<T> {
    id: string;
    value: T | null;
    createdAt: number;
    fetcher: () => Bluebird<T>;
    reserved: boolean;
}
export declare class Cache<T> {
    cache: Map<string, CacheItem<T>>;
    cacheLifetime: number;
    monitoringFrequency: number;
    waiterTimeout: number;
    waiterFrequency: number;
    isMonitoring: boolean;
    constructor({ itemLifetime, monitoringFrequency, waiterTimeout, waiterFrequency }: CacheParams);
    runMonitor(): void;
    isExpired(cacheItem: any): boolean;
    isReserved(cacheItem: any): any;
    getItem(id: string): CacheItem<T> | null | undefined;
    reserveWaiter(item: CacheItem<T>): Bluebird<CacheItem<T>>;
    reserveAndFetch({ id, fetcher }: {
        id: string;
        fetcher: () => Bluebird<T>;
    }): Bluebird<any>;
    getItemWithWait({ id, fetcher }: {
        id: string;
        fetcher: () => Bluebird<T>;
    }): Bluebird<any>;
    reserveItem(id: string, fetcher: () => Bluebird<T>): void;
    setItem(id: string, value: T, fetcher: () => Bluebird<T>): void;
}
export interface DynamicServiceClientParams {
    token: string;
    url: string;
    version?: string;
    timeout?: number;
    rpcContext?: any;
}
export declare class DynamicServiceClient {
    token: string;
    timeout: number;
    rpcContext: any;
    url: string;
    version: string | null;
    static module: string;
    constructor({ token, url, version, timeout, rpcContext }: DynamicServiceClientParams);
    options(): {
        timeout: number;
        authorization: string;
        rpcContext: any;
    };
    getModule(): string;
    moduleId(): string;
    getCached(fetcher: () => Bluebird<any>): Bluebird<any>;
    lookupModule(): Bluebird<any>;
    callFunc<T>(funcName: string, params: any): Bluebird<T>;
}
