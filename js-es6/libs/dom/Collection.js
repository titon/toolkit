/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import Element from './Element';

// TODO - test

/**
 * A class that handles a collection of `Element` elements.
 */
export default class Collection {

    // Total number of elements in the collection.
    length = 0;

    // Array of elements (containers).
    elements = [];

    /**
     * Store an array of elements and wrap each one with a `Element` class.
     *
     * @param {HTMLElement[]} elements
     */
    constructor(elements) {
        this.elements = elements.map(element => new Element(element));
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
 * Inherit methods from the `Element`.
 */
Element.getCollectionMethods().forEach(method => {
    Collection.prototype[method] = function() {
        let response = this.elements.forEach(element => element[method].apply(element, arguments));

        return (response instanceof Element) ? this : response;
    };
});

Toolkit.ElementCollection = Collection;
