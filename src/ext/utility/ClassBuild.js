/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import bem from '../utility/bem';

export default class ClassBuilder {
    constructor() {
        this.classes = [];
    }

    /**
     * Add a BEM compatible class name.
     *
     * @param {String|Array} block
     * @param {String} element
     * @param {String} modifier
     * @returns {ClassBuilder}
     */
    add(block, element = '', modifier = '') {
        this.classes.push(bem(block, element, modifier));

        return this;
    }

    /**
     * Map a list of classes and append all whos value evaluates to true.
     *
     * @param {Object} classes
     * @returns {ClassBuilder}
     */
    map(classes) {
        Object.keys(classes).forEach(key => {
            if (classes[key]) {
                this.classes.push(key);
            }
        });

        return this;
    }

    /**
     * Return all classes as a CSS valid string.
     *
     * @returns {String}
     */
    toString() {
        return this.classes.join(' ').trim();
    }
}
