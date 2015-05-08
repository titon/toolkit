/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import Toolkit from 'Toolkit';
import Container from './Container';

/**
 * A class that handles a collection of `Container` elements.
 */
export default class Collection {

    // Total number of elements in the collection.
    length = 0;

    // Array of elements (containers).
    elements = [];

    /**
     * Store an array of elements and wrap each one with a `Container` class.
     *
     * @param {HTMLElement[]} elements
     */
    constructor(elements) {
        this.elements = elements.map(element => new Container(element));
        this.length = elements.length;
    }

    /**
     * Loop over every element and call trigger the callback function.
     *
     * @param {function} func
     * @returns {Collection}
     */
    each(func) {
        for (let i = 0, l = this.length; i < l; i++) {
            func.call(this, this.elements[i], i);
        }

        return this;
    }
}

/**
 * Inherit methods from the `Container`.
 */
Container.getCollectionMethods().forEach(method => {
    Collection.prototype[method] = function() {
        let response = this.elements.forEach(element => element[method].apply(element, arguments));

        return (response instanceof Container) ? this : response;
    };
});

Toolkit.Collection = Collection;
