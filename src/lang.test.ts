import {intersection} from './lang';

describe('intersect', () => {
    test('should work for all types', () => {
        expect(intersection<number>([1, 2, 3], [2, 3, 4])).toEqual([2, 3]);
        expect(intersection<string>(['a', 'b', 'c'], ['b', 'c', 'd'])).toEqual(['b', 'c']);
        expect(intersection<boolean>([true, false], [false])).toEqual([false]);
        expect(intersection<number>([1, 2], [3, 4])).toEqual([]);
    });
})
