/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
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
 */
export default function invariant(
  condition: boolean,
  message: string,
  ...params: string[]
): boolean {
  let error = null;
  let index = 0;

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

  // Log the error in production
  if (PROD) {
    Titon.options.logger(error);

  // Throw the error in development
  } else if (DEV) {
    throw error;
  }

  return false;
}
