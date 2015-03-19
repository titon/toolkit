/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

let data = {};

export function cache(key, value) {
    var data = get(key),
        type = typeof data;

    if (type !== 'undefined' && type !== 'null') {
        return data;
    }

    return set(key, value);
}

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
    if (typeof value === 'function') {
        value = value.call();
    }

    data[key] = value;

    return value;
}
