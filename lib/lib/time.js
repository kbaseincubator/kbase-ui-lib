"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timeUnits = [
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
function niceRelativeTime(someDate, options = {}) {
    const nowDate = options.now || new Date();
    const elapsed = Math.round((nowDate.getTime() - someDate.getTime()) / 1000);
    const elapsedAbs = Math.abs(elapsed);
    const format = options.format || 'compact';
    let measure, measureAbs, unit;
    const maxDays = options.absoluteAfter || 90;
    if (elapsedAbs < 60 * 60 * 24 * maxDays) {
        if (elapsedAbs === 0) {
            return 'now';
        }
        else if (elapsedAbs < 60) {
            measure = elapsed;
            measureAbs = elapsedAbs;
            unit = makeUnit(timeUnits[1], format, measureAbs);
        }
        else if (elapsedAbs < 60 * 60) {
            measure = Math.round(elapsed / 60);
            measureAbs = Math.round(elapsedAbs / 60);
            unit = makeUnit(timeUnits[2], format, measureAbs);
        }
        else if (elapsedAbs < 60 * 60 * 24) {
            measure = Math.round(elapsed / 3600);
            measureAbs = Math.round(elapsedAbs / 3600);
            unit = makeUnit(timeUnits[3], format, measureAbs);
        }
        else {
            measure = Math.round(elapsed / (3600 * 24));
            measureAbs = Math.round(elapsedAbs / (3600 * 24));
            unit = makeUnit(timeUnits[4], format, measureAbs);
        }
        const [prefix, suffix] = measure < 0 ? ['in', null] : [null, 'ago'];
        return (prefix ? prefix + ' ' : '') + measureAbs + unit + (suffix ? ' ' + suffix : '');
    }
    else {
        if (options.format === 'compact' && nowDate.getFullYear() === someDate.getFullYear()) {
            return Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric'
            }).format(someDate);
        }
        else {
            return Intl.DateTimeFormat('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }).format(someDate);
        }
    }
}
exports.niceRelativeTime = niceRelativeTime;
function makeUnit(unit, format, value) {
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
function niceDuration(value, options = {}) {
    const minimized = [];
    const format = options.format || 'compact';
    let temp = Math.abs(value);
    const parts = timeUnits
        .map(function (unit) {
        const unitValue = temp % unit.size;
        temp = (temp - unitValue) / unit.size;
        const unitLabel = makeUnit(unit, format, unitValue);
        return {
            label: unitLabel,
            value: unitValue
        };
    })
        .reverse();
    parts.pop();
    let keep = false;
    for (let i = 0; i < parts.length; i += 1) {
        if (!keep) {
            if (parts[i].value > 0) {
                keep = true;
            }
            else {
                continue;
            }
        }
        if (options.precision && options.precision === minimized.length) {
            break;
        }
        minimized.push(parts[i]);
    }
    if (minimized.length === 0) {
        return '<' + (format !== 'compact' ? ' ' : '') + '1' + makeUnit(timeUnits[1], format, 1);
    }
    else {
        return minimized
            .map(function (item) {
            return String(item.value) + item.label;
        })
            .join(' ');
    }
}
exports.niceDuration = niceDuration;
//# sourceMappingURL=time.js.map