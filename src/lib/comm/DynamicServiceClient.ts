import Bluebird from 'bluebird';
import { ServiceWizardClient } from '../coreServices/ServiceWizard';
import { AuthorizedGenericClient } from './GenericClient';
// now import the service wizard, and one auth generic client

// type Promise<T> = Bluebird<T>

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

export class Cache<T> {
    cache: Map<string, CacheItem<T>>;
    cacheLifetime: number;
    monitoringFrequency: number;
    waiterTimeout: number;
    waiterFrequency: number;
    isMonitoring: boolean;

    constructor({ itemLifetime, monitoringFrequency, waiterTimeout, waiterFrequency }: CacheParams) {
        this.cache = new Map<string, CacheItem<T>>();

        // 10 minute cache lifetime
        this.cacheLifetime = itemLifetime || 1800000;

        // Frequency with which to monitor the cache for expired items
        // or refreshing them.
        this.monitoringFrequency = monitoringFrequency || 60000;

        // The waiter waits for a cache item to become available if it has
        // been reserved. These settings determine how long to wait
        // for a waiter to wait, and how often to check the cache item to see if it has
        // yet been fulfilled.
        this.waiterTimeout = waiterTimeout || 30000;
        this.waiterFrequency = waiterFrequency || 100;

        this.isMonitoring = false;
    }

    runMonitor() {
        if (this.isMonitoring) {
            return;
        }
        this.isMonitoring = true;
        window.setTimeout(() => {
            const newCache = new Map<string, any>();
            let cacheRenewed = false;
            Object.keys(this.cache).forEach((id) => {
                const item = this.cache.get(id);
                if (!this.isExpired(item)) {
                    newCache.set(id, item);
                    cacheRenewed = true;
                }
            });
            this.cache = newCache;
            this.isMonitoring = false;
            if (cacheRenewed) {
                this.runMonitor();
            }
        }, this.monitoringFrequency);
    }

    isExpired(cacheItem: any) {
        const now = new Date().getTime();
        const elapsed = now - cacheItem.createdAt;
        return elapsed > this.cacheLifetime;
    }

    isReserved(cacheItem: any) {
        return cacheItem.reserved;
    }

    getItem(id: string) {
        if (this.cache.get(id) === undefined) {
            return null;
        }
        const cached = this.cache.get(id);
        if (this.isExpired(cached)) {
            this.cache.delete(id);
            return;
        }
        return cached;
    }

    reserveWaiter(item: CacheItem<T>): Bluebird<CacheItem<T>> {
        return new Bluebird<CacheItem<T>>((resolve, reject) => {
            const started = new Date().getTime();
            const waiting = true;

            const waiter = () => {
                if (!waiting) {
                    return;
                }
                window.setTimeout(() => {
                    if (this.cache.has(item.id)) {
                        // If on a wait-loop cycle we discover that the
                        // cache item has been deleted, we volunteer
                        // to attempt to fetch it ourselves.
                        // The only case now for this is a cancellation
                        // of the first request to any dynamic service,
                        // which may cancel the initial service wizard
                        // call rather than the service call.
                        return this.reserveAndFetch({
                            id: item.id,
                            fetcher: item.fetcher
                        })
                            .then(() => {
                                // resolve(result);
                                // we resolve with the cache item just
                                // as if we had waited for it.
                                resolve(this.cache.get(item.id));
                            })
                            .catch((err: Error) => {
                                reject(err);
                            });
                    }
                    if (!item.reserved) {
                        resolve(item);
                    } else {
                        const elapsed = new Date().getTime() - started;
                        if (elapsed > this.waiterTimeout) {
                            this.cache.delete(item.id);
                            reject(
                                new Error(
                                    'Timed-out waiting for cache item to become available; timeout ' +
                                        this.waiterTimeout +
                                        ', waited ' +
                                        elapsed
                                )
                            );
                        } else {
                            waiter();
                        }
                    }
                }, this.waiterFrequency);
            };
            waiter();
        });
    }

    reserveAndFetch({ id, fetcher }: { id: string; fetcher: () => Bluebird<T> }) {
        // now, reserve it.
        this.reserveItem(id, fetcher);

        // and then fetch it.
        const fetchPromise = fetcher()
            .then((result: any) => {
                this.setItem(id, result, fetcher);
                return result;
            })
            .finally(() => {
                // If the fetch was cancelled, we need to remove
                // the reserved item. This should signal any queued waiters
                // to spawn their own fetch.
                if (fetchPromise.isCancelled()) {
                    this.cache.get(id);
                }
            });
        return fetchPromise;
    }

    getItemWithWait({ id, fetcher }: { id: string; fetcher: () => Bluebird<T> }) {
        const cached = this.cache.get(id);
        if (cached) {
            if (this.isExpired(cached)) {
                this.cache.delete(id);
            } else if (this.isReserved(cached)) {
                return this.reserveWaiter(cached).then((cached) => {
                    return cached.value;
                });
            } else {
                return Bluebird.resolve(cached.value);
            }
        }

        return this.reserveAndFetch({ id, fetcher });
    }

    reserveItem(id: string, fetcher: () => Bluebird<T>) {
        this.cache.set(id, {
            id: id,
            createdAt: new Date().getTime(),
            reserved: true,
            value: null,
            fetcher: fetcher
        });
    }

    setItem(id: string, value: T, fetcher: () => Bluebird<T>) {
        if (this.cache.has(id)) {
            const item = this.cache.get(id);
            if (item && item.reserved) {
                item.reserved = false;
                item.value = value;
                item.fetcher = fetcher;
            } else {
                // overwriting? should we allow this?
                this.cache.set(id, {
                    id: id,
                    createdAt: new Date().getTime(),
                    fetcher: fetcher,
                    reserved: false,
                    value: value
                });
            }
        } else {
            this.cache.set(id, {
                id: id,
                createdAt: new Date().getTime(),
                fetcher: fetcher,
                reserved: false,
                value: value
            });
        }
        this.runMonitor();
    }
}
var moduleCache = new Cache<any>({
    itemLifetime: 1800000,
    monitoringFrequency: 60000,
    waiterTimeout: 30000,
    waiterFrequency: 100
});

/*
 * arg is:
 * url - service wizard url
 * timeout - request timeout
 * version - service release version or tag
 * auth - auth structure
 *   token - auth token
 *   username - username
 * rpcContext
 */

export interface DynamicServiceClientParams {
    token: string;
    url: string;
    version?: string;
    timeout?: number;
    rpcContext?: any;
}

export class DynamicServiceClient {
    token: string;
    timeout: number;
    rpcContext: any;
    url: string;
    version: string | null;

    static module: string;

    constructor({ token, url, version, timeout, rpcContext }: DynamicServiceClientParams) {
        // Establish an auth object which has properties token and user_id.
        this.token = token;
        this.timeout = timeout || 10000;
        this.rpcContext = rpcContext || null;

        if (!url) {
            throw new Error('The service discovery url was not provided');
        }
        this.url = url;

        this.version = version || null;
        if (version === 'auto') {
            this.version = null;
        }
    }

    options() {
        return {
            timeout: this.timeout,
            authorization: this.token,
            rpcContext: this.rpcContext
        };
    }

    getModule() {
        return (this.constructor as typeof DynamicServiceClient).module;
    }

    moduleId() {
        let moduleId;
        if (!this.version) {
            moduleId = this.getModule() + ':auto';
        } else {
            moduleId = this.getModule() + ':' + this.version;
        }
        return moduleId;
    }

    getCached(fetcher: () => Bluebird<any>) {
        return moduleCache.getItemWithWait({
            id: this.moduleId(),
            fetcher: fetcher
        });
    }

    // setCached(value: any) {
    //     moduleCache.setItem(this.moduleId(), value);
    // }

    lookupModule() {
        return this.getCached(
            (): Bluebird<any> => {
                const client = new ServiceWizardClient({
                    url: this.url,
                    token: this.token,
                    timeout: this.timeout
                });
                return Bluebird.resolve(
                    client.getServiceStatus({
                        module_name: this.getModule(),
                        version: this.version
                    })
                );
            }
        );
    }

    callFunc<T>(funcName: string, params: any) {
        return this.lookupModule()
            .then((serviceStatus) => {
                const client = new AuthorizedGenericClient({
                    module: serviceStatus.module_name,
                    url: serviceStatus.url,
                    token: this.token
                });
                return Bluebird.resolve(client.callFunc<T>(funcName, params));
            })
            .catch((err) => {
                console.error('ERROR: ' + err.name + ' = ' + err.message, err);
                throw err;
            });
    }
}
