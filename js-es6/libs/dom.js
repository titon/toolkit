/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

export var

    // The document <body> element
    body = document.body,

    // The document <head> element
    head = document.head;

export function aria(element, key, value) {
    // TODO
}

export function conceal(element, dontHide) {
    // TODO
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

export function reveal(element, dontShow) {
    // TODO
}
