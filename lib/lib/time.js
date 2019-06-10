"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function niceElapsed(someDate, options = {}) {
    const nowDate = options.now || new Date();
    const elapsed = Math.round((nowDate.getTime() - someDate.getTime()) / 1000);
    const elapsedAbs = Math.abs(elapsed);
    let measure, measureAbs, unit;
    const maxDays = options.absoluteAfter || 90;
    if (elapsedAbs < 60 * 60 * 24 * maxDays) {
        if (elapsedAbs === 0) {
            return 'now';
        }
        else if (elapsedAbs < 60) {
            measure = elapsed;
            measureAbs = elapsedAbs;
            unit = options.compactDate ? ' second' : 's';
        }
        else if (elapsedAbs < 60 * 60) {
            measure = Math.round(elapsed / 60);
            measureAbs = Math.round(elapsedAbs / 60);
            unit = options.compactDate ? ' minute' : 'm';
        }
        else if (elapsedAbs < 60 * 60 * 24) {
            measure = Math.round(elapsed / 3600);
            measureAbs = Math.round(elapsedAbs / 3600);
            unit = options.compactDate ? ' hour' : 'h';
        }
        else {
            measure = Math.round(elapsed / (3600 * 24));
            measureAbs = Math.round(elapsedAbs / (3600 * 24));
            unit = options.compactDate ? ' day' : 'd';
        }
        if (measureAbs > 1 && options.compactDate) {
            unit += 's';
        }
        let prefix = null;
        let suffix = null;
        if (measure < 0) {
            prefix = 'in';
        }
        else if (measure > 0) {
            suffix = 'ago';
        }
        return (prefix ? prefix + ' ' : '') + measureAbs + unit + (suffix ? ' ' + suffix : '');
    }
    else {
        if (options.compactDate && nowDate.getFullYear() === someDate.getFullYear()) {
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
exports.niceElapsed = niceElapsed;
function niceDuration(value, options) {
    options = options || {};
    const minimized = [];
    const units = [
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
    let temp = Math.abs(value);
    const parts = units
        .map(function (unit) {
        const unitValue = temp % unit.size;
        temp = (temp - unitValue) / unit.size;
        return {
            name: unit.single,
            unit: unit.unit,
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
        return '<1s';
    }
    else {
        return minimized
            .map(function (item) {
            return String(item.value) + item.name;
        })
            .join(' ');
    }
}
exports.niceDuration = niceDuration;
//# sourceMappingURL=time.js.map