/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import HorizontalResize from 'events/HorizontalResize';

export default class VerticalResize extends HorizontalResize {

    /**
     * If the window height has changed, dispatch a `verticalresize` event.
     *
     * @param {Event} e
     */
    handle(e) {
        let currentHeight = e.currentTarget.innerHeight,
            lastHeight = this.lastSize;

        if (currentHeight !== lastHeight) {
            this.lastSize = currentHeight;

            this.dispatch('verticalresize', {
                lastHeight: lastHeight,
                currentHeight: currentHeight
            });
        }
    }
}
