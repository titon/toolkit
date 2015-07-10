/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import assign from 'lodash/object/assign';
import debounce from 'lodash/function/debounce';

export default class HorizontalResize extends Event {

    /**
     * Bind a global `resize` event handler.
     */
    constructor(context, options = {}) {
        super(context, assign({
            delay: 100 // The delay before firing the handler
        }, options));

        this.lastSize = 0;

        // Event handlers
        this.handler = debounce(this.handle.bind(this), this.options.delay);

        // Bind default events
        this.enable();
    }

    /**
     * Unbind events.
     */
    disable() {
        this.context.removeEventListener('resize', this.handler);
    }

    /**
     * Bind events.
     */
    enable() {
        this.context.addEventListener('resize', this.handler);
    }

    /**
     * If the window width has changed, dispatch a `horizontalresize` event.
     *
     * @param {Event} e
     */
    handle(e) {
        let currentWidth = e.currentTarget.innerWidth,
            lastWidth = this.lastSize;

        if (currentWidth !== lastWidth) {
            this.lastSize = currentWidth;

            this.dispatch('horizontalresize', {
                lastWidth: lastWidth,
                currentWidth: currentWidth
            });
        }
    }
}
