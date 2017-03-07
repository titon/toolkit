/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import Titon from '../Titon';

/**
 * Asserts that a condition is true or throws an error otherwise.
 * Will only throw errors in development based on the `NODE_ENV`
 * environment variable (can be removed through browserify,
 * uglify, or something similar).
 *
 * Messages can utilize parameters that are interpolated using
 * sprintf() styled `%s` syntax.
 */
export default function invariant(
  condition: boolean,
  message: string,
  ...params: string[]
): boolean {
  let error = null;
  let index = -1;

  if (condition) {
    return true;

  } else if (!message) {
    error = new Error('`invariant()` requires an error message.');

  } else {
    error = new Error(message.replace(/%s/g, () => {
      index += 1;

      return params[index] || '';
    }));
  }

  error.name = 'Invariant Violation';

  // Throw the error in development
  if (process.env.NODE_ENV !== 'production') {
    throw error;

  // Log the error in production
  } else {
    Titon.log(error);
  }

  return false;
}
