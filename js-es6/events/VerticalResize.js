/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import debounce from 'lodash/function/debounce';

class VerticalResize extends Event {

    /**
     * Bind a global `resize` event handler.
     */
    constructor() {
        super();

        this.lastHeight = 0;
        this.context.addEventListener('resize', debounce(this.handle.bind(this), 100));
    }

    /**
     * If the window height has changed, dispatch a `verticalresize` event.
     *
     * @param {Event} e
     */
    handle(e) {
        let currentHeight = e.currentTarget.innerHeight,
            lastHeight = this.lastHeight;

        if (currentHeight !== lastHeight) {
            this.lastHeight = currentHeight;

            this.dispatch('verticalresize', {
                lastHeight: lastHeight,
                currentHeight: currentHeight
            });
        }
    }
}

export default new VerticalResize();
