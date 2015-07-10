/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import { isTouch } from 'libs/flags';

class ClickOut extends Event {

    /**
     * Bind a global `click` (or `touchend` on touch devices) to monitor for click outs.
     */
    constructor() {
        super(document);

        this.elements = new Set();
        this.context.addEventListener(isTouch ? 'touchend' : 'click', this.handle.bind(this));
    }

    /**
     * Loop through all elements being monitored and verify that they have not been clicked.
     * If so, dispatch a `clickout` event to that element.
     *
     * @param {Event} e
     */
    handle(e) {
        let target = e.target;

        this.elements.forEach(element => {
            if (target !== element && !element.contains(target)) {
                this.dispatch('clickout', {
                    target: target
                }, element);
            }
        });
    }
}

export default new ClickOut();
