/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

let data = {};

export function get(key) {
    return data[key];
}

export function has(key) {
    return (key in data);
}

export function remove(key) {
    delete data[key];
}

export function set(key, value) {
    data[key] = value;

    return value;
}

export function cache(key, value) {
    var currentValue = get(key),
        type = typeof currentValue;

    if (type !== 'undefined' && type !== 'null') {
        return currentValue;
    }

    if (typeof value === 'function') {
        value = value.call();
    }

    return set(key, value);
}
