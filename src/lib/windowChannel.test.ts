import {WindowChannel, WindowChannelInit} from './windowChannel';

import {isSimpleObject} from "./simpleObject";
import {waitFor} from "@testing-library/dom";

function isEqual(v1: any, v2: any) {
    const t1 = typeof v1;
    const t2 = typeof v2
    if (t1 !== t2) {
        return false;
    }
    switch (t1) {
        case 'number':
        case 'string':
        case 'boolean':
        case 'undefined':
        case 'symbol':
            return v1 === v2;
        case 'object':
            if (Array.isArray(v1)) {
                if (Array.isArray(v2)) {
                    if (v1.length !== v2.length) {
                        return false;
                    }
                    for (const i in v1) {
                        if (!isEqual(v1[i], v2[i])) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }
            if (isSimpleObject(v1)) {
                if (isSimpleObject(v2)) {
                    const k1 = Object.keys(v1).sort();
                    const k2 = Object.keys(v2).sort();
                    if (k1.length !== k2.length) {
                        return false;
                    }
                    if (!isEqual(k1, k2)) {
                        return false;
                    }
                    for (const k of k1) {
                        if (!isEqual(v1[k], v2[k])) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return false;
                }
            }
            return false;
        default: return false;
    }
}

const WAIT_FOR_TIME = 5000;
const WAIT_FOR_INTERVAL = 50;

function myWaitFor(pred: () => boolean, timeout=WAIT_FOR_TIME): Promise<void> {
    const started = Date.now();
    return new Promise((resolve, reject) => {
        function loop() {
            if (pred()) {
                resolve();
                return;
            }
            const elapsed = Date.now() - started;
            if (elapsed >= timeout) {
                reject();
                return;
            }
            window.setTimeout(() => {
                loop();
            }, WAIT_FOR_INTERVAL);
        }
        loop();
    });
}

test('Window Channel create, send, receive simple message', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    expect(chan1.getId()).toEqual(chan1Init.getId());
    expect(chan2.getId()).toEqual(chan2Init.getId());

    expect(chan1.getPartnerId()).toEqual(chan2Init.getId());
    expect(chan2.getPartnerId()).toEqual(chan1Init.getId());

    expect(chan1.getStats()).toEqual({
        sent:0, received:0, ignored: 0
    });

    expect(chan2.getStats()).toEqual({
        sent:0, received:0, ignored: 0
    });

    let result: any;
    chan1.on('greeting', (message: any) => {
        result = message;
    });
    const payload = {hello: 'hi'};
    chan2.send('greeting', payload);
    await myWaitFor(() => {
        return isEqual(result, payload);
    });

     expect(chan1.getStats()).toEqual({
        sent: 0, received: 1, ignored: 0
     });

    expect(chan2.getStats()).toEqual({
        sent: 1, received: 0, ignored: 1
    });

    chan1.stop();
    chan2.stop();
});

test('Send a message as a promise', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    expect(chan1.getId()).toEqual(chan1Init.getId());
    expect(chan2.getId()).toEqual(chan2Init.getId());

    expect(chan1.getPartnerId()).toEqual(chan2Init.getId());
    expect(chan2.getPartnerId()).toEqual(chan1Init.getId());

    chan1.on('query', (message: any) => {
        return 'bar';
    });
    const payload = {name: 'foo'};
    const response  = await chan2.request('query', payload);
    expect(response).toEqual('bar');
    chan1.stop();
    chan2.stop();
});

test('Window Channel create, send, receive SINGLE message', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    let result: any;
    chan1.once('greeting', (message: any) => {
        result = message;
    });
    const payload = {hello: 'hi'};
    chan2.send('greeting', payload);
    await myWaitFor(() => {
        return isEqual(result, payload);
    });
    chan1.stop();
    chan2.stop();
});

test('Window Channel create, send, receive SINGLE message', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    const payload = {hello: 'hi'};
    setTimeout(() => {
        chan2.send('greeting', payload);
    }, 0);
    const result = await chan1.when('greeting', 1000);
    expect(result).toEqual(payload);
    chan1.stop();
    chan2.stop();
});

// Error conditions:

// try to send without starting
// try to start without partner
// try to send message when noot started
// etc.

test('Window Channel create, send, receive simple message', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId());

    expect(() => {
        chan1.send('greeting', {hello: 'hi'});
    }).toThrow(Error);
});

// Odd conditions

// this.window.postMessage(message.toJSON(), this.host);
test('Window Channel create, send bad message', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    window.postMessage(null, window.location.origin);
    window.postMessage({hi: 'there'}, window.location.origin);
    window.postMessage(true, window.location.origin);
    window.postMessage(false, window.location.origin);
    window.postMessage(undefined, window.location.origin);
    window.postMessage(123, window.location.origin);
    window.postMessage([1, "2", 3.4], window.location.origin);

    await new Promise<void>((resolve) => {
        window.setTimeout(() => {
            resolve();
        }, 1000);
    });

    // Now we check the stats.
    expect(chan1.getStats()).toEqual({
        sent: 0, received: 0, ignored: 7
     });

    expect(chan2.getStats()).toEqual({
        sent: 0, received: 0, ignored: 7
     });

    chan1.stop();
    chan2.stop();
});

test('Send a request, handler generates exception', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    expect(chan1.getId()).toEqual(chan1Init.getId());
    expect(chan2.getId()).toEqual(chan2Init.getId());

    expect(chan1.getPartnerId()).toEqual(chan2Init.getId());
    expect(chan2.getPartnerId()).toEqual(chan1Init.getId());

    chan1.on('query', (message: any) => {
        throw new Error('Oops!');
    });
    const payload = {name: 'foo'};
    await expect(async () => {
        try {
            return await chan2.request('query', payload);
        } catch (ex) {
            console.log('HMMY HMM', ex);
            throw ex;
        }
    }).rejects.toThrowError('Oops!');

    chan1.stop();
    chan2.stop();
});

test('Window Channel create, send, receive message with error', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    let error: Error | null = null;
    chan1.on('greeting', (message: any) => {
        throw new Error('Whoopsie!');
    }, (err: Error) => {
        error = err;
    });
    const payload = {hello: 'hi'};
    chan2.send('greeting', payload);

    await myWaitFor(() => {
        if (error != null) {
            return error.message === 'Whoopsie!';
        }
        return false;
    });

    chan1.stop();
    chan2.stop();
});


test('Window Channel create, send, receive SINGLE message with error', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId()).start();
    const chan2 = chan2Init.makeChannel(chan1Init.getId()).start();

    let error: Error | null = null;
    chan1.once('greeting', (message: any) => {
        throw new Error('Whoopsie!');
    }, (err: Error) => {
        error = err;
    });
    const payload = {hello: 'hi'};
    chan2.send('greeting', payload);

    await myWaitFor(() => {
        if (error != null) {
            return error.message === 'Whoopsie!';
        }
        return false;
    });

    chan1.stop();
    chan2.stop();
});


test('Cannot send unless start first', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId());
    const chan2 = chan2Init.makeChannel(chan1Init.getId());

    const payload = {hello: 'hi'};
    expect(() => {
        chan2.send('greeting', payload);
    }).toThrow();
});

test('Cannot request unless start first', async () => {
    const chan1Init = new WindowChannelInit();
    const chan2Init = new WindowChannelInit();

    const chan1 = chan1Init.makeChannel(chan2Init.getId());
    const chan2 = chan2Init.makeChannel(chan1Init.getId());

    const payload = {hello: 'hi'};
    await expect(chan2.request('greeting', payload)).rejects.toThrow();
});
