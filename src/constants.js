/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Detect the current environment
export const ENV = process.env.NODE_ENV || 'production';

// Export as an object
export default Object.freeze({
    env: ENV
});
