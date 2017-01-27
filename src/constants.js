/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

// Detect the current environment
export const ENV: string = process.env.NODE_ENV || 'production';

// Is the environment development?
export const DEV: boolean = (ENV === 'development' || ENV === 'develop' || ENV === 'dev');

// Or is the environment production?
export const PROD: boolean = (ENV === 'production' || ENV === 'prod');

// Export as an object
export default Object.freeze({
  dev: DEV,
  env: ENV,
  prod: PROD,
});
