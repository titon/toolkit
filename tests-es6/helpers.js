/*eslint no-unused-vars: 0*/

'use strict';

var createdElements = {},
    oldWarn = console.warn;

/**
 * Convert `console.warn()` calls to errors so that we can unit test properly.
 */
console.warn = function(message) {
    throw new Error(message);
};

/**
 * Create an element an append it to the sandbox. This element will be created before every test,
 * and cleaned up after every test.
 *
 * @param {string} tag
 * @param {object} [attributes]
 * @param {boolean} [mount]
 * @returns {HTMLElement}
 */
function createElement(tag, attributes, mount) {
    var element = document.createElement(tag),
        sandbox = document.getElementById('sandbox'),
        hash = Date.now();

    // Add attributes
    Object.keys(attributes || {}).forEach(function(key) {
        var value = attributes[key];

        if (typeof value === 'function') {
            value = value.call(null, element, key);
        }

        switch (key) {
            case 'className':
            case 'id':
                element[key] = value;
            break;
            case 'html':
                element.innerHTML = value;
            break;
            case 'css':
                Object.keys(value).forEach(function(prop) {
                    var style = value[prop];

                    if (style.indexOf('important') >= 0) {
                        element.style.setProperty(prop, style.replace('!important', '').trim(), 'important');
                    } else {
                        element.style[prop] = style;
                    }
                });
            break;
            default:
                element.setAttribute(key, value);
            break;
        }
    });

    // Add to the sandbox
    if (mount !== false) {
        sandbox.appendChild(element);
    }

    // Add a cleanup function
    element.hash = hash;
    element.cleanup = function() {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }

        delete createdElements[element.hash];
    };

    // Store the history
    createdElements[hash] = element;

    return element;
}

/**
 * Cleanup and remove all elements that were created for testing purposes.
 */
function cleanupElements() {
    Object.keys(createdElements).forEach(function(hash) {
        createdElements[hash].cleanup();
    });

    createdElements = {};
}

/**
 * Process a callback in a separate thread so that mutations trigger instantly,
 * instead of waiting for the render loop.
 *
 * @param {function} func
 */
function processInThread(func) {
    setTimeout(func, 0);
}
