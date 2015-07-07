/*eslint no-unused-vars: 0*/

'use strict';

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
        sandbox = document.getElementById('sandbox');

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

    // Add a cleanup function
    element.cleanup = function() {
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    };

    // Add to the sandbox
    if (mount !== false) {
        sandbox.appendChild(element);
    }

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
