/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import type { DecoratorTarget, MethodDecorator, ClassDecorator, Descriptor } from '../../types';

/**
 * When applying a decorator, either apply to a class, or a method.
 */
export default function decorate(
  classHandler: ClassDecorator,
  methodHandler: MethodDecorator,
  args: *[],
): DecoratorTarget | Descriptor {
  return (args.length === 1) ? classHandler(...args) : methodHandler(...args);
}
