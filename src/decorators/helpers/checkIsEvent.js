/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import invariant from '../../utility/invariant';

/**
 * Verifies that an object provided is a DOM event.
 *
 * @param {String} name
 * @param {*} event
 */
export default function checkIsEvent(name, event) {
  invariant((event && (event instanceof Event || (event.type && event.preventDefault))),
    'Only event handlers can use @%s.', name);
}
