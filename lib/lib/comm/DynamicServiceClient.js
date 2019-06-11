"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const ServiceWizard_1 = require("../coreServices/ServiceWizard");
const GenericClient_1 = require("./GenericClient");
class Cache {
    constructor({ itemLifetime, monitoringFrequency, waiterTimeout, waiterFrequency }) {
        this.cache = new Map();
        this.cacheLifetime = itemLifetime || 1800000;
        this.monitoringFrequency = monitoringFrequency || 60000;
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
            const newCache = new Map();
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
    isExpired(cacheItem) {
        const now = new Date().getTime();
        const elapsed = now - cacheItem.createdAt;
        return elapsed > this.cacheLifetime;
    }
    isReserved(cacheItem) {
        return cacheItem.reserved;
    }
    getItem(id) {
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
    reserveWaiter(item) {
        return new bluebird_1.default((resolve, reject) => {
            const started = new Date().getTime();
            const waiting = true;
            const waiter = () => {
                if (!waiting) {
                    return;
                }
                window.setTimeout(() => {
                    if (this.cache.has(item.id)) {
                        return this.reserveAndFetch({
                            id: item.id,
                            fetcher: item.fetcher
                        })
                            .then(() => {
                            resolve(this.cache.get(item.id));
                        })
                            .catch((err) => {
                            reject(err);
                        });
                    }
                    if (!item.reserved) {
                        resolve(item);
                    }
                    else {
                        const elapsed = new Date().getTime() - started;
                        if (elapsed > this.waiterTimeout) {
                            this.cache.delete(item.id);
                            reject(new Error('Timed-out waiting for cache item to become available; timeout ' +
                                this.waiterTimeout +
                                ', waited ' +
                                elapsed));
                        }
                        else {
                            waiter();
                        }
                    }
                }, this.waiterFrequency);
            };
            waiter();
        });
    }
    reserveAndFetch({ id, fetcher }) {
        this.reserveItem(id, fetcher);
        const fetchPromise = fetcher()
            .then((result) => {
            this.setItem(id, result, fetcher);
            return result;
        })
            .finally(() => {
            if (fetchPromise.isCancelled()) {
                this.cache.get(id);
            }
        });
        return fetchPromise;
    }
    getItemWithWait({ id, fetcher }) {
        const cached = this.cache.get(id);
        if (cached) {
            if (this.isExpired(cached)) {
                this.cache.delete(id);
            }
            else if (this.isReserved(cached)) {
                return this.reserveWaiter(cached).then((cached) => {
                    return cached.value;
                });
            }
            else {
                return bluebird_1.default.resolve(cached.value);
            }
        }
        return this.reserveAndFetch({ id, fetcher });
    }
    reserveItem(id, fetcher) {
        this.cache.set(id, {
            id: id,
            createdAt: new Date().getTime(),
            reserved: true,
            value: null,
            fetcher: fetcher
        });
    }
    setItem(id, value, fetcher) {
        if (this.cache.has(id)) {
            const item = this.cache.get(id);
            if (item && item.reserved) {
                item.reserved = false;
                item.value = value;
                item.fetcher = fetcher;
            }
            else {
                this.cache.set(id, {
                    id: id,
                    createdAt: new Date().getTime(),
                    fetcher: fetcher,
                    reserved: false,
                    value: value
                });
            }
        }
        else {
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
exports.Cache = Cache;
var moduleCache = new Cache({
    itemLifetime: 1800000,
    monitoringFrequency: 60000,
    waiterTimeout: 30000,
    waiterFrequency: 100
});
class DynamicServiceClient {
    constructor({ token, url, version, timeout, rpcContext }) {
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
        return this.constructor.module;
    }
    moduleId() {
        let moduleId;
        if (!this.version) {
            moduleId = this.getModule() + ':auto';
        }
        else {
            moduleId = this.getModule() + ':' + this.version;
        }
        return moduleId;
    }
    getCached(fetcher) {
        return moduleCache.getItemWithWait({
            id: this.moduleId(),
            fetcher: fetcher
        });
    }
    lookupModule() {
        return this.getCached(() => {
            const client = new ServiceWizard_1.ServiceWizardClient({
                url: this.url,
                token: this.token,
                timeout: this.timeout
            });
            return bluebird_1.default.resolve(client.getServiceStatus({
                module_name: this.getModule(),
                version: this.version
            }));
        });
    }
    callFunc(funcName, params) {
        return this.lookupModule()
            .then((serviceStatus) => {
            const client = new GenericClient_1.AuthorizedGenericClient({
                module: serviceStatus.module_name,
                url: serviceStatus.url,
                token: this.token
            });
            return bluebird_1.default.resolve(client.callFunc(funcName, params));
        })
            .catch((err) => {
            console.error('ERROR: ' + err.name + ' = ' + err.message, err);
            throw err;
        });
    }
}
exports.DynamicServiceClient = DynamicServiceClient;
//# sourceMappingURL=DynamicServiceClient.js.map