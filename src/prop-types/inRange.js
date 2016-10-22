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
function inRange(min, max) {
  return function rangePropType(props, propName, componentName) {
    const value = props[propName];

    if (value < min || value > max) {
      return new Error(`\`${componentName}\` requires a number between ${min} and ${max}.`);
    }

    return null;
  };
}

// Presets
inRange.span6 = inRange(1, 6);
inRange.span12 = inRange(1, 12);
inRange.span18 = inRange(1, 18);

export default inRange;
