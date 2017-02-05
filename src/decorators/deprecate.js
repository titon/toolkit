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
 * The `deprecated` decorator will mark a function as deprecated and will output a
 * console warning anytime the function is called.
 */
export default function deprecate(message: string = '') {
  return function deprecateDecorator(
    target: DecoratorTarget,
    name: string,
    descriptor: Descriptor,
  ): Descriptor {
    checkIsMethod('deprecated', arguments);

    ['get', 'set', 'value'].forEach((method: string) => {
      if (typeof descriptor[method] === 'function') {
        const oldMethod = descriptor[method];

        descriptor[method] = function deprecateDescriptor(): mixed {
          console.warn(`${target.constructor.name}#${name}() is deprecated. ${message}`);

          return oldMethod.apply(this, arguments);
        };
      }
    });

    return descriptor;
  };
}
