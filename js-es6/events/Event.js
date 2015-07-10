/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

export default class Event {
    constructor(context) {
        this.context = context || window;
    }

    dispatch(event, detail = {}) {
        this.context.dispatchEvent(new CustomEvent(event, {
            detail: detail
        }));
    }
}
