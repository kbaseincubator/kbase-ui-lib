/**
 * Options for the nice relative time function
 */
export interface NiceRelativeTimeOptions {
    /** The number of days after which the format will simply be the
     *  timestamp. (Honors compact setting.)
     *  Defaults to 90 days.
     */
    absoluteAfter?: number;
    /**
     * Flag to produce a more compact representation. E.g. second becomes s.
     */
    compact?: boolean;
    /**
     * The anchor time relative to which the given date is compared.
     * Defaults to Date.now()
     */
    now?: Date;
    /**
     * The number of places of precision for the time format. E.g. a value of 1
     * means to show just the left most time part, undefined means to show all.
     * Defaults to undefined
     */
    precision?: number;
}

/**
 * Given some date, returns a string representation of the amount of time between
 * a current time (defaults to now) and that given time.
 *
 * @param someDate - the date to which we want a relative time measure to
 * @param options - optional set of options as defined above.
 *
 * @example
 * ```
 * const d = new Date(Date.now() + 1000);
 * niceRelativeTime(d);
 *
 * "in 1 second"
 * ```
 */
export function niceRelativeTime(someDate: Date, options: NiceRelativeTimeOptions = {}) {
    const nowDate = options.now || new Date();

    const elapsed = Math.round((nowDate.getTime() - someDate.getTime()) / 1000);
    const elapsedAbs = Math.abs(elapsed);

    let measure, measureAbs, unit;
    const maxDays = options.absoluteAfter || 90;
    if (elapsedAbs < 60 * 60 * 24 * maxDays) {
        if (elapsedAbs === 0) {
            return 'now';
        } else if (elapsedAbs < 60) {
            measure = elapsed;
            measureAbs = elapsedAbs;
            unit = options.compact ? 's' : ' second';
        } else if (elapsedAbs < 60 * 60) {
            measure = Math.round(elapsed / 60);
            measureAbs = Math.round(elapsedAbs / 60);
            unit = options.compact ? 'm' : ' minute';
        } else if (elapsedAbs < 60 * 60 * 24) {
            measure = Math.round(elapsed / 3600);
            measureAbs = Math.round(elapsedAbs / 3600);
            unit = options.compact ? 'h' : ' hour';
        } else {
            measure = Math.round(elapsed / (3600 * 24));
            measureAbs = Math.round(elapsedAbs / (3600 * 24));
            unit = options.compact ? 'd' : ' day';
        }

        if (measureAbs !== 1 && !options.compact) {
            unit += 's';
        }

        // Note that we don't need to handle the 0 value because that is
        // filtered out above.
        const [prefix, suffix] = measure < 0 ? ['in', null] : [null, 'ago'];

        return (prefix ? prefix + ' ' : '') + measureAbs + unit + (suffix ? ' ' + suffix : '');
    } else {
        // otherwise show the actual date, with or without the year.
        if (options.compact && nowDate.getFullYear() === someDate.getFullYear()) {
            return Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(someDate);
        } else {
            return Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(someDate);
        }
    }
}

/**
 * Options for the nice duration function
 */

interface TimeUnit {
    unit: string;
    short: string;
    single: string;
    size: number;
}

const timeUnits: Array<TimeUnit> = [
    {
        unit: 'millisecond',
        short: 'ms',
        single: 'm',
        size: 1000
    },
    {
        unit: 'second',
        short: 'sec',
        single: 's',
        size: 60
    },
    {
        unit: 'minute',
        short: 'min',
        single: 'm',
        size: 60
    },
    {
        unit: 'hour',
        short: 'hr',
        single: 'h',
        size: 24
    },
    {
        unit: 'day',
        short: 'day',
        single: 'd',
        size: 30
    }
];

type Format = 'full' | 'short' | 'compact';

interface NiceDurationOptions {
    /**
     * The number of places of precision for the time format. E.g. a value of 1
     * means to show just the left most time part, undefined means to show all.
     * Defaults to undefined
     */
    precision?: number;
    /**
     * The format, either full, short, compact
     * Defaults to compact
     */
    format?: Format;
}

function makeUnit(unit: TimeUnit, format: Format, value: number) {
    switch (format) {
    case 'full':
        const label = ' ' + unit.unit;
        if (value !== 1) {
            return label + 's';
        }
        return label;
    case 'short':
        return ' ' + unit.short;
    case 'compact':
        return unit.single;
    }
}

export function niceDuration(value: number, options: NiceDurationOptions = {}) {
    const minimized = [];
    const format = options.format || 'compact';
    let temp = Math.abs(value);
    const parts = timeUnits
        .map(function (unit) {
            // Get the remainder of the current value
            // sans unit size of it composing the next
            // measure.
            const unitValue = temp % unit.size;
            // Recompute the measure in terms of the next unit size.
            temp = (temp - unitValue) / unit.size;

            const unitLabel = makeUnit(unit, format, unitValue);

            return {
                label: unitLabel,
                value: unitValue
            };
        })
        .reverse();

    parts.pop();

    // We skip over large units which have no value until we
    // hit the first unit with value. This effectively trims off
    // zeros from the beginning.
    // We also can limit the resolution with options.resolution, which
    // limits the number of time units to display.
    let keep = false;
    for (let i = 0; i < parts.length; i += 1) {
        if (!keep) {
            if (parts[i].value > 0) {
                keep = true;
            } else {
                continue;
            }
        }
        if (options.precision && options.precision === minimized.length) {
            break;
        }
        minimized.push(parts[i]);
    }

    if (minimized.length === 0) {
        // This means that there is are no time measurements > 1 second.
        return '<' + (format !== 'compact' ? ' ' : '') + '1' + makeUnit(timeUnits[1], format, 1);
    } else {
        // Skip seconds if we are into the hours...
        // if (minimized.length > 2) {
        //     minimized.pop();
        // }
        return minimized
            .map(function (item) {
                return String(item.value) + item.label;
            })
            .join(' ');
    }
}
