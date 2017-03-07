/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import checkIsEvent from './helpers/checkIsEvent';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `delegate` decorator will wrap an event handler method and delegate
 * the execution until the target element matches the defined selector.
 */
export default function delegate(selector: string) {
  return function delegateDecorator(
    target: DecoratorTarget,
    name: string,
    descriptor: Descriptor,
  ): Descriptor {
    if (process.env.NODE_ENV !== 'production') {
      checkIsMethod('delegate', arguments);
    }

    const func = getValueFunc('delegate', descriptor);

    descriptor.value = function delegateValue(event: Event) {
      if (process.env.NODE_ENV !== 'production') {
        checkIsEvent('delegate', event);
      }

      let eventTarget = event.target;

      while (eventTarget && eventTarget !== document && eventTarget instanceof Element) {
        if (eventTarget.matches(selector)) {
          // $FlowIgnore Custom property
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
