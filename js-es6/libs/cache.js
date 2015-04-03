/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

let data = {};

/**
 * Empty the cache and remove all items.
 */
export function flush() {
    data = {};
}

/**
 * Retrieve an item from the cache or return null.
 *
 * @param {string} key
 * @returns {*}
 */
export function get(key) {
    let value = data[key];

    return (typeof value === 'undefined') ? null : value;
}

/**
 * Check if an item exists in the cache.
 *
 * @param {string} key
 * @returns {boolean}
 */
export function has(key) {
    return (key in data);
}

/**
 * Remove an item defined by key.
 *
 * @param {string} key
 */
export function remove(key) {
    delete data[key];
}

/**
 * Add an item into the cache. The value set will be returned.
 *
 * @param {string} key
 * @param {*} value
 * @returns {*}
 */
export function set(key, value) {
    data[key] = value;

    return value;
}

/**
 * Set data if the key does not exist, else return the current value.
 * If the value is a function, it will be executed to extract a value.
 *
 * @param {string} key
 * @param {*} [value]
 * @returns {*}
 */
export default function cache(key, value) {
    var currentValue = get(key);

    if (currentValue !== null) {
        return currentValue;
    }

    if (typeof value === 'function') {
        value = value.call();
    }

    return set(key, value);
}
