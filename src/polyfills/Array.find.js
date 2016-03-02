/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint no-extend-native: 0, no-undefined: 0 */

if (!Array.prototype.find) {
    Array.prototype.find = function(predicate, context) {
        if (this === null) {
            throw new TypeError('`Array.prototype.find` called on null or undefined.');

        } else if (typeof predicate !== 'function') {
            throw new TypeError('Predicate must be a function.');
        }

        let list = Object(this),
            length = list.length >>> 0,
            value = null;

        for (let i = 0; i < length; i++) {
            value = list[i];

            if (predicate.call(context, value, i, list)) {
                return value;
            }
        }

        return undefined;
    };
}
