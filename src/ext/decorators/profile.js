/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint no-console: 0 */

import '../../poly/performance/now';

/**
 * The `profile` decorator can be used for profiling the time it took to execute a specific method.
 * The profiler uses the built-in `performance.now()`, which is accurate to one thousandth of a millisecond.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function profile(target, name, descriptor) {
    ['get', 'set', 'value'].forEach(method => {
        if (typeof descriptor[method] === 'function') {
            let oldMethod = descriptor[method];

            descriptor[method] = function() {
                let start = performance.now(),
                    result = oldMethod.apply(this, arguments),
                    stop = performance.now();

                console.info(`${name}() took ${(stop - start).toFixed(4)} milliseconds to run using the arguments:`, arguments);

                return result;
            };
        }
    });

    return descriptor;
}
