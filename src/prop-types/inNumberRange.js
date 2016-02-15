/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * A validator that checks that a number is between a min and max value.
 *
 * @param {Number} min
 * @param {Number} max
 * @returns {Function}
 */
export default function inNumberRange(min, max) {
    return function(props, propName, componentName) {
        let value = props[propName];

        if (value < min || value > max) {
            return new Error(`\`${componentName}\` requires a number between ${min} and ${max}.`);
        }
    };
}
