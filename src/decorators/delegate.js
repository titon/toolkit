/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsEvent from './helpers/checkIsEvent';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';
import '../polyfills/Element.matches.js';

/**
 * The `delegate` decorator will wrap an event handler method and delegate
 * the execution until the target element matches the defined selector.
 *
 * @param {String} selector
 * @returns {Function}
 */
export default function delegate(selector) {
    return function(target, name, descriptor) {
        checkIsMethod('delegate', arguments);

        let func = getValueFunc('delegate', descriptor);

        descriptor.value = function(event) {
            checkIsEvent('delegate', event);

            let target = event.target;

            while (target && target !== document) {
                if (target.matches(selector)) {
                    event.delegatedTarget = target;
                    func.call(this, event);
                    break;
                }

                target = target.parentNode;
            }
        };

        return descriptor;
    };
}
