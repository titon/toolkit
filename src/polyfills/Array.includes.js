/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint no-extend-native: 0, no-self-compare: 0 */

if (!Array.prototype.includes) {
    Array.prototype.includes = function arrayIncludes(searchElement) {
        let obj = Object(this),
            len = parseInt(obj.length, 10) || 0,
            cur = null,
            i = parseInt(arguments[1], 10) || 0,
            k = 0;

        if (len === 0) {
            return false;
        }

        if (i >= 0) {
            k = i;
        } else {
            k = len + i;

            if (k < 0) {
                k = 0;
            }
        }

        while (k < len) {
            cur = obj[k];

            // NaN !== NaN
            if (searchElement === cur || (searchElement !== searchElement && cur !== cur)) {
                return true;
            }

            k++;
        }

        return false;
    };
}
