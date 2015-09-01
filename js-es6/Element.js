/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from 'Titon';
import transitionEnd from 'extensions/event/transitionEnd';
import forOwn from 'lodash/object/forOwn';
import 'polyfills/requestAnimationFrame';
import 'polyfills/cancelAnimationFrame';

/**
 * A class that wraps an element to provide new functionality.
 * It utilizes a queueing system that batches multiple DOM mutations during an animation render frame.
 */
export default class Element {

    /** The DOM element. */
    element = null;

    /** Mapping of mutations to process. */
    queue = {};

    /** Batched reads are occurring. */
    reading = false;

    /** Timer to catch all mutations before being processed. */
    timer = 0;

    /** Batched writes are occurring. */
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
        this.startQueue();

        return this;
    }

    /**
     * Conceal the element by applying the `hide` class.
     * Should be used to trigger transitions and animations.
     *
     * @param {boolean} [hide]
     * @returns {Element}
     */
    conceal(hide = true) {
        if (this.hasClass('show') && hide) {
            transitionEnd(this.element, () => this.element.style.display = 'none');
        }

        return this
            .removeClass('show')
            .addClass('hide')
            .setAria('hidden', true);
    }

    /**
     * Return the value of an HTML attribute.
     *
     * @param {string} key
     * @returns {*}
     */
    getAttribute(key) {
        return this.element.getAttribute(key);
    }

    /**
     * Return an object of key value pairs for each key defined.
     *
     * @param {string[]} keys
     * @return {object}
     */
    getAttributes(keys) {
        let object = {};

        keys.forEach(key => object[key] = this.getAttribute(key));

        return object;
    }

    /**
     * Return a list of chainable methods to copy to the `ElementCollection` prototype.
     *
     * @returns {string[]}
     */
    static getCollectionMethods() {
        return [
            'addClass', 'removeClass', 'conceal', 'reveal', 'read', 'write',
            'setAria', 'setArias', 'setAttribute', 'setAttributes',
            'setProperty', 'setProperties', 'setStyle', 'setStyles'
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
     * Check if the element is visible. Is used for CSS animations and transitions.
     *
     * @returns {boolean}
     */
    isVisible() {
        return (this.element.style.visibility !== 'hidden');
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
            throw new Error('No element detected. Cannot process queue.');
        }

        // Loop over each mutation and process
        forOwn(queue, (value, key) => {
            switch (key) {
                case 'addClass':
                    element.classList.add(value);
                break;
                case 'removeClass':
                    element.classList.remove(value);
                break;
                case 'attributes':
                    forOwn(value, (v, k) => element.setAttribute(k, v));
                break;
                case 'properties':
                    forOwn(value, (v, k) => element[k] = v);
                break;
                case 'styles':
                    forOwn(value, (v, k) => element.style[k] = v);
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
                    func.call(this, this.element);
                    this.reading = false;

                    resolve(this);
                } catch (e) {
                    reject(this);
                }
            });
        });

        // Add a custom `write()` method that calls `then()` automatically
        promise.write = writer => {
            return promise.then(() => {
                return this.write(writer);
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
        this.startQueue();

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
            properties: {},
            styles: {}
        };

        cancelAnimationFrame(this.timer);

        return this;
    }

    /**
     * Reveal the element by applying the `show` class.
     * Should be used to trigger transitions and animations.
     *
     * @param {boolean} [show]
     * @returns {Element}
     */
    reveal(show = true) {
        if (show) {
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
        if (!Titon.aria) {
            return this;
        }

        if (key === 'toggled') {
            return this.setArias({
                expanded: value,
                selected: value
            });
        }

        return this.setAttribute('aria-' + key, value);
    }

    /**
     * Set multiple ARIA attributes.
     *
     * @param {object} keys
     * @returns {Element}
     */
    setArias(keys) {
        forOwn(keys, (value, key) => this.setAria(key, value));

        return this;
    }

    /**
     * Set a value for an HTML attribute.
     *
     * @param {string} attribute
     * @param {*} value
     * @returns {Element}
     */
    setAttribute(attribute, value) {
        this.queue.attributes[attribute] = String(value);
        this.startQueue();

        return this;
    }

    /**
     * Set multiple HTML attributes.
     *
     * @param {object} attributes
     * @returns {Element}
     */
    setAttributes(attributes) {
        forOwn(attributes, (value, key) => this.setAttribute(key, value));

        return this;
    }

    /**
     * Set a value for a DOM property.
     *
     * @param {string} property
     * @param {*} value
     * @returns {Element}
     */
    setProperty(property, value) {
        this.queue.properties[property] = value;
        this.startQueue();

        return this;
    }

    /**
     * Set multiple DOM properties.
     *
     * @param {object} properties
     * @returns {Element}
     */
    setProperties(properties) {
        forOwn(properties, (value, key) => this.setProperty(key, value));

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
        this.startQueue();

        return this;
    }

    /**
     * Set multiple CSS properties.
     *
     * @param {object} properties
     * @returns {Element}
     */
    setStyles(properties) {
        forOwn(properties, (value, key) => this.setStyle(key, value));

        return this;
    }

    /**
     * Start the queue by setting a future process task using `requestAnimationFrame`.
     * This method is called automatically from all mutators, and is used as an automatic batching system.
     *
     * @returns {Element}
     */
    startQueue() {
        cancelAnimationFrame(this.timer);

        this.timer = requestAnimationFrame(this.processQueue.bind(this));

        return this;
    }

    /**
     * Manually process the current queue by batching all DOM mutations in the rendering loop using `requestAnimationFrame`.
     * The method will also return a promise that can be used for chained reads and writes.
     *
     * @param {function} [func]
     * @returns {Promise}
     */
    write(func) {
        if (this.writing) {
            return null; // Don't allow nested write calls
        }

        // Cancel automatic writes
        cancelAnimationFrame(this.timer);

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
        promise.read = reader => {
            return promise.then(() => {
                return this.read(reader);
            });
        };

        return promise;
    }
}
