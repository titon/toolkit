/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * Generate a valid class name based on a list of parameters.
 * If the param is a string, use directly as a class name.
 * If the param is an object, loop through each key and
 * include the class name if the value is truthy.
 *
 * @param {*} params
 * @returns {String}
 */
export default function classBuilder(...params) {
    /* eslint default-case: 0 */

    let className = [];

    params.forEach(param => {
        switch (typeof param) {
            case 'object':
                Object.keys(param).forEach(key => {
                    if (param[key]) {
                        className.push(key);
                    }
                });
                break;

            case 'string':
                if (param) {
                    className.push(param);
                }
                break;
        }
    });

    return className.join(' ').trim();
}
