interface ListenerParams {
    name: string;
    onSuccess: (payload: Payload) => void;
    onError?: (error: Error) => void;
}
declare class Listener {
    name: string;
    onSuccess: (payload: Payload) => void;
    onError?: (error: Error) => void;
    constructor({ name, onSuccess, onError }: ListenerParams);
}
declare type Payload = any;
interface WaitingListenerParams extends ListenerParams {
    timeout?: number;
}
declare class WaitingListener extends Listener {
    started: Date;
    timeout: number;
    constructor(params: WaitingListenerParams);
}
declare class Envelope {
    from: string;
    to: string;
    id: string;
    created: Date;
    constructor({ from, to }: {
        from: string;
        to: string;
    });
    toJSON(): {
        from: string;
        to: string;
        id: string;
        created: Date;
    };
}
declare class Message {
    name: string;
    payload: any;
    id: string;
    created: Date;
    envelope: Envelope;
    constructor({ name, payload, from, to }: {
        name: string;
        payload: any;
        from: string;
        to: string;
    });
    toJSON(): {
        envelope: {
            from: string;
            to: string;
            id: string;
            created: Date;
        };
        name: string;
        payload: any;
    };
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
    debug?: boolean;
}
export declare class Channel {
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
    constructor(params: ChannelParams);
    setTo(toChannelId: string): void;
    genId(): string;
    receiveMessage(messageEvent: MessageEvent): void;
    listen(listener: Listener): void;
    on(messageId: string, success: (payload: any) => any, error?: (error: Error) => void): void;
    sendMessage(message: Message): void;
    send(name: string, payload: Payload): void;
    sendRequest(message: Message, handler: (response: any) => any): void;
    request(name: string, payload: Payload): Promise<unknown>;
    startMonitor(): void;
    listenOnce(listener: WaitingListener): void;
    once(name: string, success: (payload: Payload) => void, error: (error: Error) => void): void;
    when(name: string, timeout: number): Promise<unknown>;
    stats(): {
        sent: number;
        received: number;
    };
    setPartner(id: string): void;
    attach(window: Window): void;
    ensureSetup(): void;
    start(): void;
    stop(): void;
}
export {};
