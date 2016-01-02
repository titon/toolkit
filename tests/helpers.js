/* eslint-disable */

'use strict';

/**
 * Generate a sandbox for certain unit tests.
 */

var app = document.createElement('div');
    app.id = 'app';

var sandbox = document.createElement('div');
    sandbox.id = 'sandbox';

document.body.appendChild(app);
document.body.appendChild(sandbox);

/**
 * Convert `console.warn()` calls to errors so that we can unit test properly.
 */
/*var oldWarn = console.warn;

console.warn = function(message) {
    throw new Error(message);
};*/


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
    };

    return element;
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

/**
 * Parts of React log messages to the console instead of throwing errors,
 * so we should temporarily intercept these messages and throw errors instead.
 *
 * @param {Function} func
 * @param {String} [type]
 * @returns {Function}
 */
function throwConsoleMessage(func, type) {
    type = type || 'error';

    return function() {
        let old = console[type],
            error = null;

        console[type] = message => error = new Error(message);

        func();

        console[type] = old;

        if (error instanceof Error) {
            throw error;
        }
    };
}
