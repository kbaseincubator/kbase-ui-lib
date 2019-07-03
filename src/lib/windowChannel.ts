import uuid from 'uuid';

interface ListenerParams {
    name: string;
    onSuccess: (payload: Payload) => void;
    onError?: (error: Error) => void;
}

class Listener {
    name: string;
    onSuccess: (payload: Payload) => void;
    onError?: (error: Error) => void;

    constructor({ name, onSuccess, onError }: ListenerParams) {
        this.name = name;
        this.onSuccess = onSuccess;
        this.onError = onError;
    }
}

type Payload = any;

interface WaitingListenerParams extends ListenerParams {
    timeout?: number;
}

class WaitingListener extends Listener {
    started: Date;
    timeout: number;

    constructor(params: WaitingListenerParams) {
        super(params);
        this.started = new Date();
        this.timeout = params.timeout || 5000;
    }
}

class Envelope {
    from: string;
    to: string;
    id: string;
    created: Date;

    constructor({ from, to }: { from: string; to: string }) {
        this.from = from;
        this.to = to;
        this.id = uuid.v4();
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
    name: string;
    payload: any;
    id: string;
    created: Date;
    envelope: Envelope;

    constructor({ name, payload, from, to }: { name: string; payload: any; from: string; to: string }) {
        this.name = name;
        this.payload = payload;
        this.id = uuid.v4();
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

interface Handler {
    started: Date;
    handler: (response: any) => any;
}

interface ChannelParams {
    window?: Window;
    host?: string;
    id?: string;
    to?: string;
    debug?: boolean
}

export class Channel {
    window: Window;
    host: string;
    id: string;
    partnerId: string | null;
    awaitingResponse: Map<string, Handler>;
    waitingListeners: Map<string, Array<Listener>>;
    listeners: Map<string, Array<Listener>>;
    lastId: number;
    sentCount: number;
    receivedCount: number;
    unwelcomeReceivedCount: number;
    unwelcomeReceivedCountThreshhold: number;
    unwelcomeReceiptWarning: boolean;
    unwelcomeReceiptWarningCount: number;
    currentListener: ((message: MessageEvent) => void) | null;
    debug: boolean;

    constructor(params: ChannelParams) {
        // The given window upon which we will listen for messages.
        this.window = params.window || window;
        this.debug = params.debug || false;

        // The host for the window; required for postmessage
        if (this.window.document === null) {
            throw new Error('No document');
        }
        if (this.window.document.location === null) {
            throw new Error('No location');
        }
        this.host = params.host || this.window.document.location.origin;

        // The channel id. Used to filter all messages received to
        // this channel.
        this.id = params.id || uuid.v4();
        this.partnerId = params.to || null;

        this.awaitingResponse = new Map<string, Handler>();
        this.waitingListeners = new Map<string, Array<Listener>>();
        this.listeners = new Map<string, Array<Listener>>();

        this.lastId = 0;
        this.sentCount = 0;
        this.receivedCount = 0;

        this.unwelcomeReceivedCount = 0;
        this.unwelcomeReceivedCountThreshhold = 100;
        this.unwelcomeReceiptWarning = true;
        this.unwelcomeReceiptWarningCount = 0;
        this.currentListener = null;
    }

    setTo(toChannelId: string) {
        this.partnerId = toChannelId;
    }

    genId() {
        this.lastId += 1;
        return 'msg_' + String(this.lastId);
    }

    /**
     * Receives all messages sent via postMessage to the associated window.
     *
     * @param messageEvent - a post message event
     */
    receiveMessage(messageEvent: MessageEvent) {
        const message = messageEvent.data as Message;

        // Here we have a series of filters to determine whether this message should be
        // handled by this post message bus.
        // In all cases we issue a warning, and return.
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

        // Here we ignore messages intended for another windowChannel object.
        // if (message.envelope.from === this.id) {
        //     // console.warn('received own message, ignoring', message.name);
        //     return;
        // }
        if (message.envelope.to !== this.id) {
            this.unwelcomeReceivedCount++;
            if (this.unwelcomeReceiptWarning) {
                console.warn("Message envelope does not match this channel's id", 'message', message, 'channel id', this.id, 'partner id', this.partnerId);
            }
            return;
        }
        if (this.unwelcomeReceiptWarningCount > this.unwelcomeReceivedCountThreshhold) {
            this.unwelcomeReceiptWarning = false;
            console.warn(
                'Unwelcome message warning disabled after ' + this.unwelcomeReceiptWarningCount + ' instances.'
            );
        }

        // A message sent as a request will have registered a response handler
        // in the awaitingResponse hash, using a generated id as the key.
        // TODO: to to rethink using the message id here. Perhaps somehting like a
        // chain of ids, the root of which is the origination id, which is the one
        // known here when it it is sent; the message "id" should be assigned whenver
        // a message is sent, but a response  message would include the original
        // message in the "chain"...

        // We can also have awaiting responses without an originating request.
        // These are useful for, e.g., a promise which awaits a message to be sent
        // within some window...
        if (message.envelope.id && this.awaitingResponse.has(message.envelope.id)) {
            try {
                const response = this.awaitingResponse.get(message.envelope.id);
                this.awaitingResponse.delete(message.envelope.id);
                if (response) {
                    response.handler(message.payload);
                }
            } catch (ex) {
                console.error('Error handling response for message ', message, ex);
            }
        }

        // and also awaiting by message name. Like a listener, but they are only used
        // once.

        if (this.waitingListeners.has(message.name)) {
            const awaiting = this.waitingListeners.get(message.name)!;
            this.waitingListeners.delete(message.name);
            awaiting.forEach((listener) => {
                try {
                    listener.onSuccess(message.payload);
                } catch (ex) {
                    if (listener.onError) {
                        listener.onError(ex);
                    } else {
                        console.error('Error handling listener for message', message, ex);
                    }
                }
            });
        }
        // Otherwise, permanently registered handlers are found in the listeners for the
        // message name.
        if (this.listeners.has(message.name)) {
            this.listeners.get(message.name)!.forEach((listener) => {
                if (!listener.onSuccess) {
                    console.warn('no handler for listener!', listener);
                }
                try {
                    listener.onSuccess(message.payload);
                } catch (ex) {
                    if (listener.onError) {
                        listener.onError(ex);
                    } else {
                        console.error('Error handling listener for message', message, ex);
                    }
                }
            });
        }
    }

    listen(listener: Listener) {
        if (!this.listeners.has(listener.name)) {
            this.listeners.set(listener.name, []);
        }
        this.listeners.get(listener.name)!.push(listener);
    }

    on(messageId: string, success: (payload: any) => any, error?: (error: Error) => void) {
        this.listen(
            new Listener({
                name: messageId,
                onSuccess: success,
                onError: error
            })
        );
    }

    sendMessage(message: Message) {
        this.window.postMessage(message.toJSON(), this.host);
    }

    send(name: string, payload: Payload) {
        if (this.partnerId === null) {
            throw new Error('Channel partner id set, cannot send request');
        }
        const message = new Message({ name, payload, from: this.id, to: this.partnerId });
        this.sendMessage(message);
    }

    sendRequest(message: Message, handler: (response: any) => any) {
        this.awaitingResponse.set('message.id', {
            started: new Date(),
            handler: handler
        });

        this.sendMessage(message);
    }

    request(name: string, payload: Payload) {
        this.ensureSetup();
        return new Promise((resolve, reject) => {
            try {
                if (this.partnerId === null) {
                    throw new Error('Channel partner id set, cannot issue request');
                }
                this.sendRequest(new Message({ name, payload, from: this.id, to: this.partnerId }), (response: any) => {
                    resolve(response);
                });
            } catch (ex) {
                reject(ex);
            }
        });
    }

    startMonitor() {
        window.setTimeout(() => {
            const now = new Date().getTime();

            // first take care of listeners awaiting a message.
            for (const [id, listeners] of Array.from(this.waitingListeners.entries())) {
                const newListeners = listeners.filter((listener) => {
                    if (listener instanceof WaitingListener) {
                        const elapsed = now - listener.started.getTime();
                        if (elapsed > listener.timeout) {
                            try {
                                if (listener.onError) {
                                    listener.onError(new Error('timout after ' + elapsed));
                                }
                            } catch (ex) {
                                console.error('Error calling error handler', id, ex);
                            }
                            return false;
                        } else {
                            return true;
                        }
                    } else {
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

    listenOnce(listener: WaitingListener) {
        if (!this.waitingListeners.has(listener.name)) {
            this.waitingListeners.set(listener.name, []);
        }
        this.waitingListeners.get(listener.name)!.push(listener);
        if (listener.timeout) {
            this.startMonitor();
        }
    }

    once(name: string, success: (payload: Payload) => void, error: (error: Error) => void) {
        this.listenOnce(
            new WaitingListener({
                name: name,
                onSuccess: success,
                onError: error
            })
        );
    }

    when(name: string, timeout: number) {
        return new Promise((resolve, reject) => {
            return this.listenOnce(
                new WaitingListener({
                    name: name,
                    timeout: timeout,
                    onSuccess: (payload) => {
                        resolve(payload);
                    },
                    onError: (error) => {
                        reject(error);
                    }
                })
            );
        });
    }

    stats() {
        return {
            sent: this.sentCount,
            received: this.receivedCount
        };
    }

    setPartner(id: string) {
        this.partnerId = id;
    }

    attach(window: Window) {
        this.window = window;
    }

    ensureSetup() {
        if (!this.partnerId) {
            throw new Error('No partner channel id set. Cannot send or receive messages.');
        }
    }

    start() {
        this.ensureSetup();
        this.currentListener = (message: MessageEvent) => {
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
