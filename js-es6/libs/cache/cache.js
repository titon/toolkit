/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import Storage from 'libs/cache/Storage';

// Use a shared cache
const internalCache = new Storage();

/**
 * Set data if the key does not exist, else return the current value.
 * If the value is a function, it will be executed to extract a value.
 *
 * @param {string} key
 * @param {*} [value]
 * @returns {*}
 */
export default function cache(key, value = null) {
    var currentValue = internalCache.get(key);

    if (currentValue !== null || value === null) {
        return currentValue;
    }

    if (typeof value === 'function') {
        value = value();
    }

    return internalCache.set(key, value);
}

Toolkit.cache = cache;
