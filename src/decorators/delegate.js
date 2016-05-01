/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import checkIsEvent from './helpers/checkIsEvent';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

/**
 * The `delegate` decorator will wrap an event handler method and delegate
 * the execution until the target element matches the defined selector.
 *
 * @param {String} selector
 * @returns {Function}
 */
export default function delegate(selector) {
    return function delegateDecorator(target, name, descriptor) {
        checkIsMethod('delegate', arguments);

        let func = getValueFunc('delegate', descriptor);

        descriptor.value = function delegateValue(event) {
            checkIsEvent('delegate', event);

            let eventTarget = event.target;

            while (eventTarget && eventTarget !== document) {
                if (eventTarget.matches(selector)) {
                    event.delegatedTarget = eventTarget;
                    func.call(this, event);
                    break;
                }

                eventTarget = eventTarget.parentNode;
            }
        };

        return descriptor;
    };
}
