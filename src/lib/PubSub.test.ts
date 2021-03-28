import PubSub, { Message, PubSubProxy } from './PubSub';

const TIMEOUT = 10000;

let spy: any;

beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    if (spy) {
        spy.mockRestore();
    }
});

test('listen for and receive a simple message', async () => {
    return new Promise((resolve) => {

        const pubsub = new PubSub();

        pubsub.on('test', (message: Message) => {
            expect(message).toEqual({ it: 'works' });
            resolve(null);
        });

        pubsub.send('test', { it: 'works' });
    });
});


test('listen for and receive multiple simple messages', async () => {
    return new Promise((resolve) => {
        const pubsub = new PubSub();

        let messageReceivedCount = 0;

        pubsub.on('test', (message: Message) => {
            expect(message).toEqual({ it: 'works' });
            messageReceivedCount += 1;
        });

        window.setTimeout(() => {
            expect(messageReceivedCount).toEqual(3);
            resolve(null);
        }, 1000);

        pubsub.send('test', { it: 'works' });
        pubsub.send('test', { it: 'works' });
        pubsub.send('test', { it: 'works' });
    });
});


test('send non-existent message', async () => {
    return new Promise((resolve) => {
        const pubsub = new PubSub();

        let shouldNotBeSet: null | boolean = null;

        pubsub.on('test', (message: Message) => {
            // expect(message).toEqual({ it: 'does nothing' });
            // done();
            shouldNotBeSet = true;
        });

        pubsub.send('test2', { it: 'does nothing' });

        window.setTimeout(() => {
            expect(shouldNotBeSet).toBeNull();
            resolve(null);
        }, 1000);
    });
});

test('receive an error which generates an error ', async () => {
    return new Promise((resolve) => {
        const pubsub = new PubSub();

        pubsub.on('test', (message: Message) => {
            throw new Error('an error');
        }, (err: Error) => {
            expect(err.message).toEqual('an error');
            resolve(null);
        });

        pubsub.send('test', { it: 'generates error!' });
    });
});

test('receive an error which generates an error ', async () => {
    return new Promise((resolve) => {
        const pubsub = new PubSub();

        pubsub.on('test', (message: Message) => {
            throw new Error('an error');
        });

        pubsub.send('test', { it: 'generates error!' });

        window.setTimeout(() => {
            expect(console.error).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toContain('ERROR not handled: an error');
            resolve(null);
        }, 1000);
    });
});

test('receive an error which generates an error in the error handler! ', async () => {
    return new Promise((resolve) => {
        const pubsub = new PubSub();

        pubsub.on('test', (message: Message) => {
            throw new Error('an error');
        }, (err: Error) => {
            throw new Error('another error!');
        });

        window.setTimeout(() => {
            expect(console.error).toHaveBeenCalled();
            expect(spy.mock.calls[0][0]).toEqual('ERROR in error handler: another error!');
            resolve(null);
        }, 1000);

        pubsub.send('test', { it: 'generates error!' });
    });
});


test('send a message, receive, off it, send again, does nothing', async () => {
    const pubsub = new PubSub();
    let temp: string | null = null;
    let id = pubsub.on('test', (message: Message) => {
        expect(message).toEqual({ it: 'works' });
        temp = 'works';
    });;

    return new Promise((resolve) => {
        pubsub.send('test', { it: 'works' });
        window.setTimeout(() => {
            expect(temp).toEqual('works');
            resolve(null);
        }, 1000);
    })
        .then(() => {
            pubsub.off(id);
            temp = null;
            pubsub.send('test', { it: 'works' });
            return new Promise((resolve) => {
                window.setTimeout(() => {
                    expect(temp).toBeNull();
                    resolve(null);
                }, 1000);
            });
        });
});

test('send a message, receive, wrong off it, send again, still works', async () => {
    const pubsub = new PubSub();
    let temp: string | null = null;
    pubsub.on('test', (message: Message) => {
        expect(message).toEqual({ it: 'works' });
        temp = 'works';
    });;

    return new Promise((resolve) => {
        pubsub.send('test', { it: 'works' });
        window.setTimeout(() => {
            expect(temp).toEqual('works');
            resolve(null);
        }, 1000);
    })
        .then(() => {
            pubsub.off('123');
            temp = null;
            pubsub.send('test', { it: 'works' });
            return new Promise((resolve) => {
                window.setTimeout(() => {
                    expect(temp).toEqual('works');
                    resolve(null);
                }, 1000);
            });
        });
});

test('send and receive via the proxy', () => {
    return new Promise((resolve) => {
        const pubsub = new PubSub();
        const proxy = new PubSubProxy(pubsub);

        proxy.on('test', (message: Message) => {
            expect(message).toEqual({ it: 'works' });
            resolve(null);
        });

        pubsub.send('test', { it: 'works' });
    });
});

function doTimes(times: number, doit: (time: number) => void) {
    for (let i = 0; i < 10; i += 1) {
        doit(i);
    }
}

test('create and remove several listeners', async () => {
    const pubsub = new PubSub();
    const proxy = new PubSubProxy(pubsub);

    let temp: Array<string | null> = new Array(10);

    doTimes(10, (i) => {
        temp[i] = null;
        proxy.on(`test${i}`, (message: Message) => {
            expect(message).toEqual({ it: `works ${i}` });
            temp[i] = `works ${i}`;
        });;
    });

    return new Promise((resolve) => {
        doTimes(10, (i) => {
            proxy.send(`test${i}`, { it: `works ${i}` });
            temp[i] = null;
        });
        window.setTimeout(() => {
            doTimes(10, (i) => {
                expect(temp[i]).toEqual(`works ${i}`);
            });
            resolve(null);
        }, 1000);
    })
        .then(() => {
            proxy.off();
            doTimes(10, (i) => {
                proxy.send(`test${i}`, { it: `works ${i}` });
                temp[i] = null;
            });
            return new Promise((resolve) => {
                window.setTimeout(() => {
                    doTimes(10, (i) => {
                        expect(temp[i]).toBeNull();
                    });
                    resolve(null);
                }, 1000);
            });
        });
});