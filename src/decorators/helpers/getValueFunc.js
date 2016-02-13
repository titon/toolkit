/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import invariant from '../../utility/invariant';

/**
 * Returns the `value` function from the descriptor, or throws an error otherwise.
 *
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Function}
 */
export default function getValueFunc(name, descriptor) {
    let func = descriptor.value;

    invariant((typeof func === 'function'),
        'Only functions can be used by @%s.', name);

    return func;
}
