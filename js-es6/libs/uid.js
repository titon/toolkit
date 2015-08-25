/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

const UIDhistory = {};

/**
 * Keeps a history of UID counts by name. If a name does not exist, create it and increment.
 *
 * @param {string} name
 * @returns {number}
 */
export default function uid(name) {
    let value = UIDhistory[name] || 0;

    return UIDhistory[name] = value += 1;
}
