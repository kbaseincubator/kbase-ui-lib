export type JSONScalarValue = string | number | boolean | null;

export type JSONValue = JSONScalarValue | JSONObject | JSONArray;

export interface JSONObjectOf<T extends JSONValue> {
    [x: string]: T;
}

export type JSONObject = JSONObjectOf<JSONValue>;

export interface JSONArrayOf<T extends JSONValue> extends Array<T> { };

export type JSONArray = JSONArrayOf<JSONValue>;

export function isJSONObject(value: any): value is JSONObject {
    if (typeof value !== 'object') {
        return false;
    }
    if (value === null) {
        return false;
    }
    if (value.constructor !== {}.constructor) {
        return false;
    }
    return !Object.keys(value).some((key) => {
        return !isJSONValue(value[key]);
    });
}

export function isJSONArray(value: any): value is JSONArray {
    if (!Array.isArray(value)) {
        return false;
    }
    return !value.some((subvalue) => {
        return !isJSONValue(subvalue);
    });
}

export function isJSONValue(value: any): value is JSONValue {
    const typeOf = typeof value;
    if (['string', 'number', 'boolean'].indexOf(typeOf) >= 0) {
        return true;
    }

    if (typeof value !== 'object') {
        return false;
    }
    if (value === null) {
        return true;
    }
    if (isJSONArray(value)) {
        return true;
    }
    if (isJSONObject(value)) {
        return true;
    }

    return false;
}

// TODO: what is the point of this??
export function objectToJSONObject(obj: {}): JSONObject {
    const x: JSONObject = {};
    for (const [k, v] of Object.entries(obj)) {
        if (typeof k !== undefined) {
            // TODO: Ensure json value
            x[k] = v as JSONValue;
        }
    }
    return x;
}

export function normalizePropPath(propPath: PropsPath): Array<string> {
    if (typeof propPath === 'string') {
        return propPath.split('.');
    } else if (Array.isArray(propPath)) {
        return propPath;
    }
    throw new TypeError('Invalid type for key: ' + (typeof propPath));
}

export type PropsPath = string | Array<string>;

export function traverse(obj: JSONObject, path: PropsPath, defaultValue?: JSONValue): JSONValue {
    const propPath = normalizePropPath(path);
    let current = obj;
    const currentPath = [];
    for (const [index, pathElement] of propPath.entries()) {
        currentPath.push(pathElement);
        if (pathElement in current) {
            const prop = current[pathElement];
            if (index === propPath.length - 1) {
                return prop;
            }
            if (isJSONObject(prop)) {
                current = prop;
            } else {
                throw new Error(`Cannot navigate into type "${typeof prop}" on path "${currentPath.join('.')}"`)
            }
        } else {
            if (typeof defaultValue === 'undefined') {
                throw new Error(`Cannot find path ${propPath.join('.')} in object`)
            } else {
                return defaultValue;
            }
        }
    }
    return current;
}