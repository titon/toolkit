/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import invariant from '../../utility/invariant';

import type { Descriptor } from '../../types';

/**
 * Returns the `value` function from the descriptor, or throws an error otherwise.
 */
export default function getValueFunc(name: string, descriptor: Descriptor) {
  const func = descriptor.value;

  invariant((typeof func === 'function'), 'Only functions can be used by @%s.', name);

  return func;
}
