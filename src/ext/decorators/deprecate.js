/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint no-console: 0 */

import checkIsMethod from './helpers/checkIsMethod';

/**
 * The `deprecated` decorator will mark a function as deprecated and will output a
 * console warning anytime the function is called.
 *
 * @param {String} [message]
 * @returns {Function}
 */
export default function deprecate(message = '') {
    return function(target, name, descriptor) {
        checkIsMethod('deprecated', arguments);

        ['get', 'set', 'value'].forEach(method => {
            if (typeof descriptor[method] === 'function') {
                let oldMethod = descriptor[method];

                descriptor[method] = function() {
                    console.warn(`${target.constructor.name}#${name}() is deprecated. ${message}`);

                    return oldMethod.apply(this, arguments);
                };
            }
        });

        return descriptor;
    };
}
