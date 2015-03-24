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

/**
 * Position the element relative to another element in the document, or to the mouse cursor.
 * Determine the offsets through the `relativeTo` argument, which can be an event, or an element.
 * Re-position the element if its target coordinates fall outside of the viewport.
 * Optionally account for mouse location and base offset coordinates.
 *
 * @param {HTMLElement} element
 * @param {string} position
 * @param {Event|Element} relativeTo
 * @param {boolean} [isMouse]
 * @param {object} [baseOffset]
 * @returns {HTMLElement}
 */
export function positionTo(element, position, relativeTo, isMouse, baseOffset) {
    if (!position) {
        return element;
    }

    let offset = baseOffset || { left: 0, top: 0 },
        relOffset,
        relHeight = 0,
        relWidth = 0,
        eHeight = element.offsetHeight,
        eWidth = element.offsetWidth,
        win = window;

    // If an event is used, position it near the mouse
    if (relativeTo instanceof Event) {
        relOffset = { left: relativeTo.pageX, top: relativeTo.pageY };

    // Else position it near the element
    } else {
        relOffset = relativeTo.getBoundingClientRect();
        relHeight = relativeTo.offsetHeight;
        relWidth = relativeTo.offsetWidth;
    }

    offset.left += relOffset.left;
    offset.top += relOffset.top;

    var top = offset.top,
        left = offset.left;

    // Shift around based on edge positioning
    var parts = position.split('-'),
        edge = { y: parts[0], x: parts[1] };

    if (edge.y === 'top') {
        top -= eHeight;

    } else if (edge.y === 'bottom') {
        top += relHeight;

    } else if (edge.y === 'center') {
        top -= Math.round((eHeight / 2) - (relHeight / 2));
    }

    if (edge.x === 'left') {
        left -= eWidth;

    } else if (edge.x === 'right') {
        left += relWidth;

    } else if (edge.x === 'center') {
        left -= Math.round((eWidth / 2) - (relWidth / 2));
    }

    // Shift again to keep it within the viewport
    if (left < 0) {
        left = 0;

    } else if ((left + eWidth) > win.innerWidth) {
        left = win.innerWidth - eWidth;
    }

    if (top < 0) {
        top = 0;

    } else if ((top + eHeight) > (win.innerHeight + win.pageYOffset)) {
        top = relOffset.top - eHeight;
    }

    // Increase the offset in case we are following the mouse cursor
    // We need to leave some padding for the literal cursor to not cause a flicker
    if (isMouse) {
        if (edge.y === 'center') {
            if (edge.x === 'left') {
                left -= 15;
            } else if (edge.x === 'right') {
                left += 15;
            }
        }

        if (edge.x === 'center') {
            if (edge.y === 'top') {
                top -= 10;
            } else if (edge.y === 'bottom') {
                top += 10;
            }
        }
    }

    // Set the position
    element.style.top = top;
    element.style.left = left;

    return element;
}
