/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

import extend from 'dom/extend';

// The document <body> element
export var body = document.body;

// The document <head> element
export var head = document.head;

/**
 * Batch multiple mutations of an element to limit the reflow and repaint.
 *
 * @param {HTMLElement} element
 * @param {function} func
 * @param {*} context
 * @returns {HTMLElement}
 */
export function batch(element, func, context) {
    let parent = element.parentNode,
        next = element.nextSibling;

    // Exit if no parent
    if (!parent) {
        return element;
    }

    // Detach from the DOM
    parent.removeChild(element);

    // Execute callback
    func.call(context || element, element);

    // Re-attach in the DOM
    parent.insertBefore(element, next);

    return element;
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

/**
 * Find an element or a collection of elements using a CSS selector.
 * This method will return an array of elements.
 *
 * @param {string} query
 * @param {Node} [context]
 * @returns {HTMLElement[]}
 */
export function find(query, context = document) {
    return Array.of(context.querySelectorAll(query)).map(element => extend(element));
}

/**
 * Return an element by ID. This method will return a single element.
 *
 * @param {string} query
 * @returns {HTMLElement}
 */
export function id(query) {
    return extend(document.getElementById(query));
}

/**
 * Check to see if a value is an element, usually one that extends `HTMLElement`.
 *
 * @param {*} element
 * @returns {boolean}
 */
export function isElement(element) {
    return ('HTMLElement' in window)
        ? (element instanceof HTMLElement)
        : (element.nodeName && element.nodeType && element.nodeType === 1);
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
