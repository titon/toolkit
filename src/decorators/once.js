/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsEvent from './helpers/checkIsEvent';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `once` decorator will wrap a method and only execute it once.
 * This decorator is similar to `memoize`, but will also remove an event listener
 * if the method being executed has been registered as one.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function once(target, name, descriptor) {
    checkIsMethod('once', arguments);

    let func = getValueFunc('once', descriptor),
        called = false,
        response = null,
        handler = function(event) {
            if (called) {
                return response;
            }

            // Execute the original function and store its response
            response = func.apply(this, arguments);
            called = true;

            // If we are dealing with an event
            // Let's attempt to remove the event listener
            try {
                checkIsEvent('once', event);
                event.target.removeEventListener(event.type, handler);
            } catch (e) {}

            return response;
        };

    descriptor.value = handler;

    return descriptor;
}
