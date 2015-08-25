/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Event from 'events/Event';
import { isTouch } from 'extensions/flags';

export default class ClickOut extends Event {

    /**
     * Bind a global `click` (or `touchend` on touch devices) event to monitor for click outs.
     */
    constructor() {
        super(document);

        this.elements = new Set();

        // Event handlers
        this.handler = this.handle.bind(this);

        // Bind default events
        this.enable();
    }

    /**
     * Unbind events.
     */
    disable() {
        this.context.removeEventListener(isTouch ? 'touchend' : 'click', this.handler);
    }

    /**
     * Bind events.
     */
    enable() {
        this.context.addEventListener(isTouch ? 'touchend' : 'click', this.handler);
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

    /**
     * Add an element to the list to be monitored.
     *
     * @param {HTMLElement|HTMLElement[]} element
     */
    monitor(element) {
        if (Array.isArray(element)) {
            element.forEach(el => this.elements.add(el));

        } else {
            this.elements.add(element);
        }
    }
}
