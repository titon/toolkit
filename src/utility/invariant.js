/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Titon from '../Titon';
import { DEV, PROD } from '../constants';

/**
 * Asserts that a condition is true or throws an error otherwise.
 * Will only throw errors in development based on the `NODE_ENV`
 * environment variable (can be removed through browserify,
 * uglify, or something similar).
 *
 * Messages can utilize parameters that are interpolated using
 * sprintf() styled `%s` syntax.
 *
 * @param {*} condition
 * @param {String} message
 * @param {...String} params
 * @returns {Boolean}
 */
export default function invariant(condition, message = '', ...params) {
  let error = null,
    index = 0;

  if (condition) {
    return true;
  } else if (message === '') {
    error = new Error('`invariant()` requires an error message.');
  } else {
    error = new Error(message.replace(/%s/g, () => params[index++]));
  }

  error.name = 'Invariant Violation';
  error.framesToPop = 1;

    // Log the error in production
  if (PROD) {
    Titon.options.logger(error);

    // Throw the error in development
  } else if (DEV) {
    throw error;
  }

  return false;
}
