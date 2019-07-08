"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const uuid_1 = __importDefault(require("uuid"));
class Listener {
    constructor({ name, onSuccess, onError }) {
        this.name = name;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }
}
class WaitingListener extends Listener {
    constructor(params) {
        super(params);
        this.started = new Date();
        this.timeout = params.timeout || 5000;
    }
}
class Envelope {
    constructor({ from, to }) {
        this.from = from;
        this.to = to;
        this.id = uuid_1.default.v4();
        this.created = new Date();
    }
    toJSON() {
        return {
            from: this.from,
            to: this.to,
            id: this.id,
            created: this.created
        };
    }
}
class Message {
    constructor({ name, payload, from, to }) {
        this.name = name;
        this.payload = payload;
        this.id = uuid_1.default.v4();
        this.created = new Date();
        this.envelope = new Envelope({ from, to });
    }
    toJSON() {
        return {
            envelope: this.envelope.toJSON(),
            name: this.name,
            payload: this.payload
        };
    }
}
class Channel {
    constructor(params) {
        this.window = params.window || window;
        this.debug = params.debug || false;
        if (this.window.document === null) {
            throw new Error('No document');
        }
        if (this.window.document.location === null) {
            throw new Error('No location');
        }
        this.host = params.host || this.window.document.location.origin;
        this.id = params.id || uuid_1.default.v4();
        this.debugLog('Setting partner id to ' + params.to);
        this.partnerId = params.to || null;
        this.awaitingResponse = new Map();
        this.waitingListeners = new Map();
        this.listeners = new Map();
        this.lastId = 0;
        this.sentCount = 0;
        this.receivedCount = 0;
        this.unwelcomeReceivedCount = 0;
        this.unwelcomeReceivedCountThreshhold = 100;
        this.unwelcomeReceiptWarning = true;
        this.unwelcomeReceiptWarningCount = 0;
        this.currentListener = null;
    }
    debugLog(message) {
        if (this.debug) {
            console.log('[windowChannel][' + this.id + '] ' + message);
        }
    }
    setTo(toChannelId) {
        this.partnerId = toChannelId;
    }
    genId() {
        this.lastId += 1;
        return 'msg_' + String(this.lastId);
    }
    receiveMessage(messageEvent) {
        const message = messageEvent.data;
        if (!message) {
            this.unwelcomeReceivedCount++;
            if (this.unwelcomeReceiptWarning) {
                console.warn('TS No message data; message ignored', messageEvent);
            }
            return;
        }
        if (!message.envelope) {
            this.unwelcomeReceivedCount++;
            if (this.unwelcomeReceiptWarning) {
                console.warn('No message envelope, not from KBase; message ignored', messageEvent);
            }
            return;
        }
        if (this.debug) {
            console.debug('[windowChannel][debug]', this.id, message.envelope.to, this.partnerId, message.envelope.from, message);
        }
        if (message.envelope.to !== this.id) {
            this.unwelcomeReceivedCount++;
            if (this.unwelcomeReceiptWarning) {
                console.warn("Message envelope does not match this channel's id", 'message', message, 'channel id', this.id, 'partner id', this.partnerId);
            }
            return;
        }
        if (this.unwelcomeReceiptWarningCount > this.unwelcomeReceivedCountThreshhold) {
            this.unwelcomeReceiptWarning = false;
            console.warn('Unwelcome message warning disabled after ' + this.unwelcomeReceiptWarningCount + ' instances.');
        }
        if (message.envelope.id && this.awaitingResponse.has(message.envelope.id)) {
            try {
                const response = this.awaitingResponse.get(message.envelope.id);
                this.awaitingResponse.delete(message.envelope.id);
                if (response) {
                    response.handler(message.payload);
                }
            }
            catch (ex) {
                console.error('Error handling response for message ', message, ex);
            }
        }
        if (this.waitingListeners.has(message.name)) {
            const awaiting = this.waitingListeners.get(message.name);
            this.waitingListeners.delete(message.name);
            awaiting.forEach((listener) => {
                try {
                    listener.onSuccess(message.payload);
                }
                catch (ex) {
                    if (listener.onError) {
                        listener.onError(ex);
                    }
                    else {
                        console.error('Error handling listener for message', message, ex);
                    }
                }
            });
        }
        if (this.listeners.has(message.name)) {
            this.listeners.get(message.name).forEach((listener) => {
                if (!listener.onSuccess) {
                    console.warn('no handler for listener!', listener);
                }
                try {
                    listener.onSuccess(message.payload);
                }
                catch (ex) {
                    if (listener.onError) {
                        listener.onError(ex);
                    }
                    else {
                        console.error('Error handling listener for message', message, ex);
                    }
                }
            });
        }
    }
    listen(listener) {
        if (!this.listeners.has(listener.name)) {
            this.listeners.set(listener.name, []);
        }
        this.listeners.get(listener.name).push(listener);
    }
    on(messageId, success, error) {
        this.listen(new Listener({
            name: messageId,
            onSuccess: success,
            onError: error
        }));
    }
    sendMessage(message) {
        this.window.postMessage(message.toJSON(), this.host);
    }
    send(name, payload) {
        this.debugLog(' sending message: ' + name + ', with payload: ' + JSON.stringify(payload));
        if (this.partnerId === null) {
            throw new Error('Channel partner id not set, cannot send message');
        }
        const message = new Message({ name, payload, from: this.id, to: this.partnerId });
        this.sendMessage(message);
    }
    sendRequest(message, handler) {
        this.awaitingResponse.set('message.id', {
            started: new Date(),
            handler: handler
        });
        this.sendMessage(message);
    }
    request(name, payload) {
        return new Promise((resolve, reject) => {
            try {
                if (this.partnerId === null) {
                    throw new Error('Channel partner id not set, cannot issue request');
                }
                this.sendRequest(new Message({ name, payload, from: this.id, to: this.partnerId }), (response) => {
                    resolve(response);
                });
            }
            catch (ex) {
                reject(ex);
            }
        });
    }
    startMonitor() {
        window.setTimeout(() => {
            const now = new Date().getTime();
            for (const [id, listeners] of Array.from(this.waitingListeners.entries())) {
                const newListeners = listeners.filter((listener) => {
                    if (listener instanceof WaitingListener) {
                        const elapsed = now - listener.started.getTime();
                        if (elapsed > listener.timeout) {
                            try {
                                if (listener.onError) {
                                    listener.onError(new Error('timout after ' + elapsed));
                                }
                            }
                            catch (ex) {
                                console.error('Error calling error handler', id, ex);
                            }
                            return false;
                        }
                        else {
                            return true;
                        }
                    }
                    else {
                        return true;
                    }
                });
                if (newListeners.length === 0) {
                    this.waitingListeners.delete(id);
                }
            }
            if (this.waitingListeners.size > 0) {
                this.startMonitor();
            }
        }, 100);
    }
    listenOnce(listener) {
        if (!this.waitingListeners.has(listener.name)) {
            this.waitingListeners.set(listener.name, []);
        }
        this.waitingListeners.get(listener.name).push(listener);
        if (listener.timeout) {
            this.startMonitor();
        }
    }
    once(name, success, error) {
        this.listenOnce(new WaitingListener({
            name: name,
            onSuccess: success,
            onError: error
        }));
    }
    when(name, timeout) {
        return new Promise((resolve, reject) => {
            return this.listenOnce(new WaitingListener({
                name: name,
                timeout: timeout,
                onSuccess: (payload) => {
                    resolve(payload);
                },
                onError: (error) => {
                    reject(error);
                }
            }));
        });
    }
    stats() {
        return {
            sent: this.sentCount,
            received: this.receivedCount
        };
    }
    setPartner(id) {
        this.partnerId = id;
    }
    attach(window) {
        this.window = window;
    }
    start() {
        if (this.debug) {
            console.log('[windowChannel][' + this.id + '] starting');
        }
        this.currentListener = (message) => {
            this.receiveMessage(message);
        };
        this.window.addEventListener('message', this.currentListener, false);
    }
    stop() {
        if (this.currentListener) {
            this.window.removeEventListener('message', this.currentListener, false);
        }
    }
}
exports.Channel = Channel;
//# sourceMappingURL=windowChannel.js.map