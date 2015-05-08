/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Toolkit from 'Toolkit';
import transitionEnd from '../event/transitionEnd';
import forOwn from '../object/forOwn';
import 'polyfills/requestAnimationFrame';

// TODO - test

/**
 * A class that wraps an element to provide new functionality.
 * Uses a queueing system that batches multiple DOM mutations at an interval.
 */
export default class Element {

    // The DOM element.
    element = null;

    // Mapping of mutations to process.
    queue = {};

    // Batched reads are occurring.
    reading = false;

    // Batched writes are occurring.
    writing = false;

    /**
     * Store the DOM element.
     *
     * @param {HTMLElement} element
     */
    constructor(element) {
        this.element = element;
        this.resetQueue();
    }

    /**
     * Add a class to the element.
     *
     * @param {string} className
     * @returns {Element}
     */
    addClass(className) {
        this.queue.addClass = className;

        return this;
    }

    /**
     * Conceal the element by applying the `hide` class.
     * Should be used to trigger transitions and animations.
     *
     * @param {boolean} [dontHide]
     * @returns {Element}
     */
    conceal(dontHide) {
        if (this.hasClass('show') && !dontHide) {
            transitionEnd(this, () => this.setStyle('display', 'none').write());
        }

        return this
            .removeClass('show')
            .addClass('hide')
            .setAria('hidden', true);
    }

    /**
     * Return a list of chainable methods to copy to the `Collection` prototype.
     *
     * @returns {string[]}
     */
    static getCollectionMethods() {
        return [
            'addClass', 'hasClass', 'removeClass', 'conceal', 'reveal', 'read', 'write',
            'setAria', 'setArias', 'setAttribute', 'setAttributes', 'setStyle', 'setStyles'
        ];
    }

    /**
     * Verify that a class exists on the element.
     *
     * @param {string} className
     * @returns {boolean}
     */
    hasClass(className) {
        return this.element.classList.contains(className);
    }

    /**
     * Process the current container queue by looping over every element in the collection
     * and mutating it based on the items in the queue.
     *
     * @returns {Element}
     */
    processQueue() {
        let queue = this.queue,
            element = this.element;

        // Exit early if no element
        if (!element) {
            throw new Error('No element in container. Cannot process queue.');
        }

        // Loop over each mutation and process
        forOwn(queue, (key, value) => {
            switch (key) {
                case 'addClass':
                    element.classList.add(value);
                break;
                case 'removeClass':
                    element.classList.remove(value);
                break;
                case 'attributes':
                    forOwn(value, (k, v) => element.setAttribute(k, v));
                break;
                case 'styles':
                    forOwn(value, (k, v) => element.style[k] = v);
                break;
            }
        });

        // Reset the queue
        this.resetQueue();

        return this;
    }

    /**
     * Read information from the current element using a callback function.
     * The method will also return a promise that can be used for chained reads and writes.
     *
     * @param {function} func
     * @returns {Promise}
     */
    read(func) {
        if (this.reading) {
            return null; // Don't allow nested read calls
        }

        let promise = new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                try {
                    this.reading = true;
                    func.call(this);
                    this.reading = false;

                    resolve(this);
                } catch (e) {
                    reject(this);
                }
            });
        });

        // Add a custom `write()` method that calls `then()` automatically
        promise.write = (func) => {
            promise.then(() => {
                this.write(func);
            });
        };

        return promise;
    }

    /**
     * Remove a class from the element.
     *
     * @param {string} className
     * @returns {Element}
     */
    removeClass(className) {
        this.queue.removeClass = className;

        return this;
    }

    /**
     * Reset the current queue.
     *
     * @returns {Element}
     */
    resetQueue() {
        this.queue = {
            attributes: {},
            styles: {}
        };

        return this;
    }

    /**
     * Reveal the element by applying the show class.
     * Should be used to trigger transitions and animations.
     *
     * @param {boolean} [dontShow]
     * @returns {Element}
     */
    reveal(dontShow) {
        if (!dontShow) {
            this.setStyle('display', '');
        }

        return this
            .removeClass('hide')
            .addClass('show')
            .setAria('hidden', false);
    }

    /**
     * Set a value for a defined ARIA attribute.
     * If ARIA is disabled globally, this will do nothing.
     *
     * @param {string} key
     * @param {*} value
     * @returns {Element}
     */
    setAria(key, value) {
        if (!Toolkit.aria) {
            return this;
        }

        if (key === 'toggled') {
            return this.setArias({
                expanded: value,
                selected: value
            });
        }

        return this.setAttribute('aria-' + key, String(value));
    }

    /**
     * Set multiple ARIA attributes.
     *
     * @param {object} keys
     * @returns {Element}
     */
    setArias(keys) {
        forOwn(keys, this.setAria);

        return this;
    }

    /**
     * Set a value for an HTML/DOM attribute.
     *
     * @param {string} attribute
     * @param {*} value
     * @returns {Element}
     */
    setAttribute(attribute, value) {
        this.queue.attributes[attribute] = value;

        return this;
    }

    /**
     * Set multiple HTML/DOM attributes.
     *
     * @param {object} attributes
     * @returns {Element}
     */
    setAttributes(attributes) {
        forOwn(attributes, this.setAttribute);

        return this;
    }

    /**
     * Set a value for a CSS property.
     *
     * @param {string} property
     * @param {*} value
     * @returns {Element}
     */
    setStyle(property, value) {
        this.queue.styles[property] = value;

        return this;
    }

    /**
     * Set multiple CSS properties.
     *
     * @param {object} properties
     * @returns {Element}
     */
    setStyles(properties) {
        forOwn(properties, this.setStyle);

        return this;
    }

    /**
     * Process the current queue by batching all DOM mutations in the rendering loop using `requestAnimationFrame`.
     * The method will also return a promise that can be used for chained reads and writes.
     *
     * @param {function} [func]
     * @returns {Promise}
     */
    write(func) {
        if (this.writing) {
            return null; // Don't allow nested write calls
        }

        // Batched writes are optional
        if (typeof func === 'function') {
            this.writing = true;
            func.call(this);
            this.writing = false;
        }

        let promise = new Promise((resolve, reject) => {
            requestAnimationFrame(() => {
                try {
                    this.processQueue();
                    resolve(this);
                } catch (e) {
                    reject(this);
                }
            });
        });

        // Add a custom `read()` method that calls `then()` automatically
        promise.read = (func) => {
            promise.then(() => {
                this.read(func);
            });
        };

        return promise;
    }
}

Toolkit.Element = Element;
