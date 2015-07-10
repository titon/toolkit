/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

export default class Event {

    /**
     * Store the context in which to bind events. Defaults to `window`.
     *
     * @param {*} context
     * @param {object} options
     */
    constructor(context, options = {}) {
        this.context = context || window;
        this.options = options;
    }

    /**
     * Dispatch a custom event in the defined context.
     *
     * @param {string} event
     * @param {object} detail
     * @param {*} context
     */
    dispatch(event, detail = {}, context = null) {
        (context || this.context).dispatchEvent(new CustomEvent(event, {
            detail: detail
        }));
    }
}
