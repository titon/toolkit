/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint no-invalid-this: 0, no-empty: 0 */

import checkIsEvent from './helpers/checkIsEvent';
import checkIsMethod from './helpers/checkIsMethod';
import getValueFunc from './helpers/getValueFunc';

import type { DecoratorTarget, Descriptor } from '../types';

const onceCache = new WeakMap();

/**
 * The `once` decorator will wrap a method and only execute it once.
 * This decorator is similar to `memoize`, but will also remove an event listener
 * if the method being executed has been registered as one.
 */
export default function once(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  checkIsMethod('once', arguments);

  const func = getValueFunc('once', descriptor);
  let response = null;

  function onceDecorator(event: Event) {
    if (onceCache.has(this)) {
      return onceCache.get(this);
    }

    // Execute the original function and store its response
    response = func.apply(this, arguments);
    onceCache.set(this, response);

    // If we are dealing with an event
    // Let's attempt to remove the event listener
    try {
      checkIsEvent('once', event);
      event.target.removeEventListener(event.type, onceDecorator);
      onceCache.delete(this);
    } catch (e) {}

    return response;
  }

  descriptor.value = onceDecorator;

  return descriptor;
}
