/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

const memoizeCache = new WeakMap();

/**
 * The `memoize` decorator will cache the result of a function/method and return that same value
 * on each subsequent call. Will only work on methods with no arguments.
 *
 * @param {Object} target
 * @param {String} name
 * @param {Object} descriptor
 * @returns {Object}
 */
export default function memoize(target, name, descriptor) {
    let method = descriptor.get ? 'get' : 'value',
        getter = descriptor[method];

    if (typeof getter !== 'function') {
        throw new SyntaxError('Only functions can be memoized.');
    }

    descriptor[method] = function() {
        if (arguments.length) {
            throw new SyntaxError(`The memoize() decorator does not support arguments for ${name}().`);
        }

        let hash = memoizeCache.get(this);

        if (!hash) {
            hash = Object.create(null);
            memoizeCache.set(this, hash);
        }

        if (name in hash) {
            return hash[name];
        }

        return hash[name] = getter.apply(this, arguments);
    };

    return descriptor;
}
