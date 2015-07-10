/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import debounce from 'lodash/function/debounce';

class HorizontalResize extends Event {

    /**
     * Bind a global `resize` event handler.
     */
    constructor() {
        super();

        this.lastWidth = 0;
        this.context.addEventListener('resize', debounce(this.handle.bind(this), 100));
    }

    /**
     * If the window width has changed, dispatch a `horizontalresize` event.
     *
     * @param {Event} e
     */
    handle(e) {
        let currentWidth = e.currentTarget.innerWidth,
            lastWidth = this.lastWidth;

        if (currentWidth !== lastWidth) {
            this.lastWidth = currentWidth;

            this.dispatch('horizontalresize', {
                lastWidth: lastWidth,
                currentWidth: currentWidth
            });
        }
    }
}

export default new HorizontalResize();
