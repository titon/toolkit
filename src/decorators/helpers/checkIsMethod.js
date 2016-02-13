/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import invariant from '../../utility/invariant';

/**
 * Verifies that a decorator is only applied to a class method or function.
 *
 * @param {String} name
 * @param {Arguments} args
 */
export default function checkIsMethod(name, args) {
    invariant((args.length === 3 && typeof args[2] === 'object'),
        'Only methods are supported by @%s.', name);
}
