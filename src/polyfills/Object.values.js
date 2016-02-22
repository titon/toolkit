/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

if (!Object.values) {
    Object.values = function(obj) {
        let values = [];

        for (let key in obj) {
            if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
                values.push(obj[key]);
            }
        }

        return values;
    };
}
