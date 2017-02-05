/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

/* eslint no-console: 0 */

import checkIsMethod from './helpers/checkIsMethod';

import type { DecoratorTarget, Descriptor } from '../types';

/**
 * The `profile` decorator can be used for profiling the time it took to execute a specific method.
 */
export default function profile(
  target: DecoratorTarget,
  name: string,
  descriptor: Descriptor,
): Descriptor {
  checkIsMethod('profile', arguments);

  ['get', 'set', 'value'].forEach((method: string) => {
    if (typeof descriptor[method] === 'function') {
      const oldMethod = descriptor[method];

      descriptor[method] = function profileDescriptor() {
        const start = Date.now();
        const result = oldMethod.apply(this, arguments);
        const stop = (Date.now() - start).toFixed(4);

        console.info(
          `${name}() took ${stop} milliseconds to run using the arguments:`,
          arguments,
        );

        return result;
      };
    }
  });

  return descriptor;
}
