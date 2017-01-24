/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/**
 * When applying a decorator, either apply to a class, or a method.
 *
 * @param {Function} classHandler
 * @param {Function} methodHandler
 * @param {Arguments} args
 * @returns {Object}
 */
export default function decorate(classHandler, methodHandler, args) {
  if (args.length === 1) {
    return classHandler(...args);
  }

  return methodHandler(...args);
}
