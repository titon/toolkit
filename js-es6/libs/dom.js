/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import * as obj from 'object';
import * as util from 'util';

// The document <body> element
export var body = document.body;

// The document <head> element
export var head = document.head;


let setAria = util.setter((key, value) => {
    if (value === true) {
        value = 'true';
    } else if (value === false) {
        value = 'false';
    }

    this.setAttribute('aria-' + key, value);
});

let setAttr = util.setter((key, value) => {
    this.setAttribute(key, value);
});

class ElementChain {
    constructor(element) {
        this.elements = Array.isArray(element) ? element : [element];
    }

    addClass(className) {
        return this.map(element => element.classList.add(className));
    }

    aria(key, value) {
        if (!Toolkit.aria) {
            return this;
        }

        if (key === 'toggled') {
            key = { expanded: value, selected: value };
        }

        return this.map(element => setAria(element, key, value));
    }

    attr(key, value) {
        return this.map(element => setAttr(element, key, value));
    }

    conceal(dontHide) {
        if (this.hasClass('show') && !dontHide) {
            ///this.transitionend(function() {
            //    $(this).hide();
            //});
            // TODO
        }

        return this
            .removeClass('show')
            .addClass('hide')
            .aria('hidden', true);
    }

    hasClass(className) {
        return this.elements.some(element => element.classList.contains(className));
    }

    map(callback) {
        this.elements.forEach(callback);

        return this;
    }

    removeClass(className) {
        return this.map(element => element.classList.remove(className));
    }

    reveal(dontShow) {
        if (!dontShow) {
            this.map(element => element.style.display = '');
        }

        // We must place in a timeout or transitions do not occur
        setTimeout(() => {
            this.removeClass('hide')
                .addClass('show')
                .aria('hidden', false);
        }, 1);

        return this;
    }
}

/**
 * Check to see if an element is within the current DOM.
 *
 * @param {Node} element
 * @returns {boolean}
 */
export function contains(element) {
    return (element === body) ? false : body.contains(element);
}

export function chain(element) {
    return new ElementChain(element);
}

/**
 * Find an element or a collection of elements using a CSS selector.
 * This method will return an array of elements.
 *
 * @param {string} query
 * @param {Node} [context]
 * @returns {HTMLElement[]}
 */
export function find(query, context) {
    context = context || document;

    return Array.prototype.slice.call(context.querySelectorAll(query));
}

/**
 * Return an element by ID. This method will return a single element.
 *
 * @param {string} query
 * @returns {HTMLElement}
 */
export function id(query) {
    return document.getElementById(query);
}

/**
 * Check to see if a value is an element, usually one that extends `HTMLElement`.
 *
 * @param {*} element
 * @returns {boolean}
 */
export function isElement(element) {
    if ('HTMLElement' in window) {
        return (element instanceof HTMLElement);
    }

    return (element.nodeName && element.nodeType && element.nodeType === 1);
}

/**
 * Check if the element is visible. Is used for CSS animations and transitions.
 *
 * @param {HTMLElement} element
 * @returns {boolean}
 */
export function isVisible(element) {
    return (element.style.visibility !== 'hidden');
}

export function positionTo(element, position, relativeTo, baseOffset, isMouse) {
    // TODO
}
