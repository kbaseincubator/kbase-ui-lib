import {isJSONObject, isJSONArray, isJSONValue, JSONObject, objectToJSONObject, traverse} from './json';

let spy: any;

beforeEach(() => {
    spy = jest.spyOn(console, 'error').mockImplementation(() => { });
});

afterEach(() => {
    if (spy) {
        spy.mockRestore();
    }
});

test('Is a JSON object', () => {
    const possibleObject = {
        hi: 'there'
    };

    expect(isJSONObject(possibleObject)).toEqual(true);
});

test('Are not JSON object', () => {
    const possibleObjects: Array<any> = [
        1,
        true,
        false,
        null,
        'hello',
        [1, 2, 'hi'],
        undefined,
        new Date()
    ];

    possibleObjects.forEach((possibleObject) => {
        expect(isJSONObject(possibleObject)).toEqual(false);
    });
});

test('Is a JSON array', () => {
    const possibleArray = [1, 2, true, false, null, 'hello', [1, 2, 3], { hi: 'there' }];

    expect(isJSONArray(possibleArray)).toEqual(true);
});

test('Are not JSON array', () => {
    const possibleArrays: Array<any> = [
        1,
        true,
        false,
        null,
        'hello',
        { hi: 'there' },
        undefined,
        new Date()
    ];

    possibleArrays.forEach((possibleArray) => {
        expect(isJSONArray(possibleArray)).toEqual(false);
    });
});

test('Is a JSON Value', () => {
    const possibleValues: Array<any> = [
        1,
        true,
        false,
        null,
        'hello',
        { hi: 'there' },
        ['hi', 1, 0, true, false, null, [1], { hi: 'there' }],
        {
            number: 1,
            boolean1: true,
            boolean2: false,
            null: null,
            array: [1, 2, 3],
            object: { hi: 'there' }
        }
    ];

    possibleValues.forEach((possibleValue) => {
        expect(isJSONValue(possibleValue)).toEqual(true);
    });
});

test('Is NOT a JSON Value', () => {
    const possibleValues: Array<any> = [
        undefined,
        new Date(),
        [undefined],
        [new Date()],
        {
            undefined: undefined,
        },
        {
            date: new Date(),
        }
    ];

    possibleValues.forEach((possibleValue) => {
        expect(isJSONValue(possibleValue)).toEqual(false);
    });
});

test('objectToJSONObject', () => {
    const input = {hi: 'there'};
    const expected: JSONObject = {hi: 'there'};
    const result = objectToJSONObject(input);
    expect(result).toEqual(expected)
});

test('traversal', () => {
    const obj: JSONObject = {
        'meaning': {
            'of': {
                'life': 42,
                'dog': 'bark'
            }
        }
    }
    expect(traverse(obj, 'meaning.of.life')).toEqual(42);
    expect(traverse(obj, 'meaning.of.dog')).toEqual('bark');
    expect(traverse(obj, 'meaning.of.poop', 'stinky')).toEqual('stinky');
});