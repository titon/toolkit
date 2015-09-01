/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Cast a string to a specific type depending on the raw contents of the string.
 *
 * @param {string} value
 * @returns {*}
 */
export default function cast(value) {
    if (value === 'true') {
        return true;

    } else if (value === 'false') {
        return false;

    } else if (value === 'null') {
        return null;

    // Only convert to a number if it doesn't change the string
    // Thanks to jQuery for the implementation
    } else if (+value + '' === value) {
        return +value;
    }

    return value;
}
