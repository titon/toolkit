/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import invariant from '../../utility/invariant';

/**
 * Verifies that a decorator is only applied to a class method or function.
 */
export default function checkIsMethod(name: string, args: *[]) {
  invariant((args.length === 3 && typeof args[2] === 'object'),
    'Only methods are supported by @%s.', name);
}
