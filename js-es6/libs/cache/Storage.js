/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';

/**
 * A simple class for getting, setting, and removing a cache of data.
 */
export default class Storage {
    data = {};

    /**
     * Empty the cache and remove all items.
     *
     * @returns {Storage}
     */
    flush() {
        this.data = {};

        return this;
    }

    /**
     * Retrieve an item from the cache or return null.
     *
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        let value = this.data[key];

        return (typeof value === 'undefined') ? null : value;
    }

    /**
     * Check if an item exists in the cache.
     *
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return (key in this.data);
    }

    /**
     * Remove an item defined by key.
     *
     * @param {string} key
     * @returns {Storage}
     */
    remove(key) {
        delete this.data[key];

        return this;
    }

    /**
     * Add an item into the cache. The value set will be returned.
     *
     * @param {string} key
     * @param {*} value
     * @returns {*}
     */
    set(key, value) {
        this.data[key] = value;

        return value;
    }
}

Toolkit.Storage = Storage;
