/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Verifies that an object provided is a DOM event.
 *
 * @param {String} name
 * @param {*} event
 */
export default function checkIsEvent(name, event) {
    if (!(event && (event instanceof Event || event.type && event.target && event.preventDefault))) {
        throw new SyntaxError(`Only event handlers can use @${name}.`);
    }
}
