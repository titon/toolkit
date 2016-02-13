/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import invariant from '../../utility/invariant';

/**
 * Verifies that a decorator is only applied to a class.
 *
 * @param {String} name
 * @param {Arguments} args
 */
export default function checkIsClass(name, args) {
    invariant((args.length === 1 && typeof args[0] === 'function'),
        'Only classes are supported by @%s.', name);
}
