import { niceDuration, niceRelativeTime } from './time';

const secMs = 1000;
const minMs = 60 * secMs;
const hourMs = 60 * minMs;
const dayMs = 24 * hourMs;

// Tests for duration

it('relative time, many permutations, compact', () => {
    const now = Date.now();
    const testDataTable = [
        // compact, precision 1
        {
            args: [0, { precision: 1 }],
            expected: '<1s'
        },
        {
            args: [secMs, { precision: 1 }],
            expected: '1s'
        },
        {
            args: [minMs, { precision: 1 }],
            expected: '1m'
        },
        {
            args: [hourMs, { precision: 1 }],
            expected: '1h'
        },
        {
            args: [dayMs, { precision: 1 }],
            expected: '1d'
        },
        // medium, precision 1
        {
            args: [0, { precision: 1, format: 'short' }],
            expected: '< 1 sec'
        },
        {
            args: [secMs, { precision: 1, format: 'short' }],
            expected: '1 sec'
        },
        {
            args: [minMs, { precision: 1, format: 'short' }],
            expected: '1 min'
        },
        {
            args: [hourMs, { precision: 1, format: 'short' }],
            expected: '1 hr'
        },
        {
            args: [dayMs, { precision: 1, format: 'short' }],
            expected: '1 day'
        },
        // full, precision 1
        {
            args: [0, { precision: 1, format: 'full' }],
            expected: '< 1 second'
        },
        {
            args: [secMs, { precision: 1, format: 'full' }],
            expected: '1 second'
        },
        {
            args: [minMs, { precision: 1, format: 'full' }],
            expected: '1 minute'
        },
        {
            args: [hourMs, { precision: 1, format: 'full' }],
            expected: '1 hour'
        },
        {
            args: [dayMs, { precision: 1, format: 'full' }],
            expected: '1 day'
        }
    ];
    testDataTable.forEach((testData) => {
        const result = niceDuration.apply(null, testData.args);
        expect(result).toEqual(testData.expected);
    });
});

it('renders a duration for 0', () => {
    const duration = 0;
    const result = niceDuration(duration);
    expect(result).toEqual('<1s');
});

it('renders a duration for 1 second', () => {
    const duration = 1000;
    const result = niceDuration(duration);
    expect(result).toEqual('1s');
});

it('renders a duration for 1 minute', () => {
    const duration = 60000;
    const result = niceDuration(duration, { precision: 1 });
    expect(result).toEqual('1m');
});

it('renders a duration for 1 hour, minimal precision', () => {
    const duration = 3600000;
    const result = niceDuration(duration, { precision: 1 });
    expect(result).toEqual('1h');
});

it('renders a duration for 1 hour, full precision', () => {
    const duration = 3600000;
    const result = niceDuration(duration);
    expect(result).toEqual('1h 0m 0s');
});

it('renders a duration for 1 day, minimal precision', () => {
    const duration = 24 * 3600000;
    const result = niceDuration(duration, { precision: 1 });
    expect(result).toEqual('1d');
});

// Tests for elapsed

it('renders an relative time for now', () => {
    const refDate = new Date();
    const nowDate = refDate;
    const result = niceRelativeTime(refDate, { now: nowDate });
    expect(result).toEqual('now');
});

it('renders an relative time for 1 second from now', () => {
    const refDate = new Date(Date.now() + 1000);
    const result = niceRelativeTime(refDate, { format: 'full' });
    expect(result).toEqual('in 1 second');
});

it('renders an relative time for 2 seconds from now', () => {
    const refDate = new Date(Date.now() + 2000);
    const result = niceRelativeTime(refDate, { format: 'full' });
    expect(result).toEqual('in 2 seconds');
});

it('renders an relative time for 2 seconds from now, compact', () => {
    const refDate = new Date(Date.now() + 2000);
    const result = niceRelativeTime(refDate, { format: 'compact' });
    expect(result).toEqual('in 2s');
});

it('renders an relative time for 1 second ago', () => {
    const refDate = new Date(Date.now() - 1000);
    const result = niceRelativeTime(refDate, { format: 'full' });
    expect(result).toEqual('1 second ago');
});

it('renders an relative time for 2 second ago', () => {
    const refDate = new Date(Date.now() - 2000);
    const result = niceRelativeTime(refDate, { format: 'full' });
    expect(result).toEqual('2 seconds ago');
});

it('renders an relative time for 1 minute ago', () => {
    const refDate = new Date(Date.now() - 60000);
    const result = niceRelativeTime(refDate, { format: 'full' });
    expect(result).toEqual('1 minute ago');
});

it('renders an relative time for 1 hour ago', () => {
    const refDate = new Date(Date.now() - 3600000);
    const result = niceRelativeTime(refDate, { format: 'full' });
    expect(result).toEqual('1 hour ago');
});

it('renders many conditions, non-compact', () => {
    const now = Date.now();
    const testDataTable = [
        {
            args: [new Date(now - secMs), { format: 'full' }],
            expected: '1 second ago'
        },
        {
            args: [new Date(now - 2 * secMs), { format: 'full' }],
            expected: '2 seconds ago'
        },
        {
            args: [new Date(now - minMs), { format: 'full' }],
            expected: '1 minute ago'
        },
        {
            args: [new Date(now - 2 * minMs), { format: 'full' }],
            expected: '2 minutes ago'
        },
        {
            args: [new Date(now - hourMs), { format: 'full' }],
            expected: '1 hour ago'
        },
        {
            args: [new Date(now - 2 * hourMs), { format: 'full' }],
            expected: '2 hours ago'
        },
        {
            args: [new Date(now - dayMs), { format: 'full' }],
            expected: '1 day ago'
        },
        {
            args: [new Date(now - 2 * dayMs), { format: 'full' }],
            expected: '2 days ago'
        },
        // compact
        {
            args: [new Date(now - secMs), { format: 'compact' }],
            expected: '1s ago'
        },
        {
            args: [new Date(now - 2 * secMs), { format: 'compact' }],
            expected: '2s ago'
        },
        {
            args: [new Date(now - minMs), { format: 'compact' }],
            expected: '1m ago'
        },
        {
            args: [new Date(now - 2 * minMs), { format: 'compact' }],
            expected: '2m ago'
        },
        {
            args: [new Date(now - hourMs), { format: 'compact' }],
            expected: '1h ago'
        },
        {
            args: [new Date(now - 2 * hourMs), { format: 'compact' }],
            expected: '2h ago'
        },
        {
            args: [new Date(now - dayMs), { format: 'compact' }],
            expected: '1d ago'
        },
        {
            args: [new Date(now - 2 * dayMs), { format: 'compact' }],
            expected: '2d ago'
        },
        // in the future
        {
            args: [new Date(now + secMs), { format: 'full' }],
            expected: 'in 1 second'
        },
        {
            args: [new Date(now + 2 * secMs), { format: 'full' }],
            expected: 'in 2 seconds'
        },
        {
            args: [new Date(now + minMs), { format: 'full' }],
            expected: 'in 1 minute'
        },
        {
            args: [new Date(now + 2 * minMs), { format: 'full' }],
            expected: 'in 2 minutes'
        },
        {
            args: [new Date(now + hourMs), { format: 'full' }],
            expected: 'in 1 hour'
        },
        {
            args: [new Date(now + 2 * hourMs), { format: 'full' }],
            expected: 'in 2 hours'
        },
        {
            args: [new Date(now + dayMs), { format: 'full' }],
            expected: 'in 1 day'
        },
        {
            args: [new Date(now + 2 * dayMs), { format: 'full' }],
            expected: 'in 2 days'
        }
    ];
    testDataTable.forEach((testData) => {
        const result = niceRelativeTime.apply(null, testData.args);
        expect(result).toEqual(testData.expected);
    });
});

it('renders an relative time beyond the limit', () => {
    const refDate = new Date(Date.now() + 90 * dayMs);
    const result = niceRelativeTime(refDate);
    const expected = Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).format(refDate);
    expect(result).toEqual(expected);
});

it('renders an relative time beyond the limit', () => {
    const nowDate = new Date('2019-01-01T00:00:00');
    const refDate = new Date(nowDate.getTime() + 90 * dayMs);
    const result = niceRelativeTime(refDate, { format: 'compact', now: nowDate });
    const expected = Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    }).format(refDate);
    expect(result).toEqual(expected);
});
