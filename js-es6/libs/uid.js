/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

const history = {};

/**
 * Keeps a history of UID counts by name. If a name does not exist, create it and increment.
 *
 * @param {string} name
 * @returns {number}
 */
export default function uid(name) {
    let value = history[name] || 0;

    return history[name] = value += 1;
}
