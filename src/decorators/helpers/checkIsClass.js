/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import invariant from '../../utility/invariant';

/**
 * Verifies that a decorator is only applied to a class.
 */
export default function checkIsClass(name: string, args: *[]) {
  invariant((args.length === 1 && typeof args[0] === 'function'),
    'Only classes are supported by @%s.', name);
}
