/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Detect the current environment
export const ENV = process.env.NODE_ENV || 'production';

// Is the environment development?
export const DEV = (ENV === 'development' || ENV === 'develop' || ENV === 'dev');

// Or is the environment production?
export const PROD = (ENV === 'production' || ENV === 'prod');

// Export as an object
export default Object.freeze({
    dev: DEV,
    env: ENV,
    prod: PROD
});
