/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import debounce from 'lodash/function/debounce';

class HorizontalResize extends Event {
    constructor(context) {
        super(context);

        this.lastWidth = 0;
        this.context.addEventListener('resize', debounce(this.handle.bind(this), 100));
    }

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

// Set on window by default
const windowHorizontalResize = new HorizontalResize();

export default HorizontalResize;
