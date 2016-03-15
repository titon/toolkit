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
function range(min, max) {
    return function(props, propName, componentName) {
        let value = props[propName];

        if (value < min || value > max) {
            return new Error(`\`${componentName}\` requires a number between ${min} and ${max}.`);
        }

        return true;
    };
}

// Presets
range.span6 = range(1, 6);
range.span12 = range(1, 12);
range.span18 = range(1, 18);

export default range;
