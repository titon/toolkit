/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Titon from '../Titon';
import assign from 'lodash/assign';
import bind from '../decorators/bind';
import once from '../decorators/once';

const body = document.body;
const blackout = document.createElement('div');
const state = {
    scrollable: true,
    blackened: false
};

class DocumentState {

    /**
     * Prepare the blackout element.
     */
    constructor() {
        blackout.id = 'titon-blackout';
        blackout.className = (Titon.options.autoNamespace ? Titon.options.namespace : '') + 'blackout';
        body.appendChild(blackout);
    }

    /**
     * Disable document scrolling by adding a class to the body.
     */
    disableScrolling() {
        if (!state.scrollable) {
            return;
        }

        body.classList.add('no-scroll');
        state.scrollable = false;
    }

    /**
     * Empty the blackout by removing all child elements.
     */
    emptyBlackout() {
        blackout.innerHTML = '';
    }

    /**
     * Enable document scrolling by removing a class to the body.
     */
    enableScrolling() {
        if (state.scrollable) {
            return;
        }

        body.classList.remove('no-scroll');
        state.scrollable = true;
    }

    /**
     * Return an immutable object of the current document state.
     *
     * @returns {Object}
     */
    getState() {
        return Object.freeze(assign({}, state));
    }

    /**
     * Handler that resets the blackout content once the hide transitions finishes.
     */
    @bind
    @once
    handleOnBlackoutHide() {
        this.emptyBlackout();
    }

    /**
     * Hide the blackout and remove the inner content.
     */
    hideBlackout() {
        if (!state.blackened) {
            return;
        }

        blackout.addEventListener('transitionend', this.handleOnBlackoutHide);
        blackout.classList.remove('is-expanded');
        state.blackened = false;
    }

    /**
     * Show the blackout and inject markup within (for loading states, etc).
     * The markup can be a string, an HTML element, or a React element.
     *
     * @param {String|HTMLElement|ReactElement} content
     */
    showBlackout(content) {
        // Do not check `blackened` so that the content can be changed

        // Convert React elements to generic markup strings
        // As we should not support additional virtual DOMs
        if (React.isValidElement(content)) {
            content = ReactDOMServer.renderToStaticMarkup(content);
        }

        // Inject the markup into the blackout
        if (typeof content === 'string') {
            blackout.innerHTML = content;

        } else if (content instanceof HTMLElement) {
            blackout.appendChild(content);
        }

        blackout.classList.add('is-expanded');
        state.blackened = true;
    }

    /**
     * Show the blackout if the condition evaluates to true, else hide it.
     *
     * @param {Boolean} condition
     * @param {String|HTMLElement|ReactElement} content
     */
    toggleBlackout(condition, content) {
        if (condition) {
            this.showBlackout(content);
        } else {
            this.hideBlackout();
        }
    }

    /**
     * Enable document scrolling if the condition evaluates to true,
     * else disable scrolling.
     *
     * @param {Boolean} condition
     */
    toggleScrolling(condition) {
        if (condition) {
            this.enableScrolling();
        } else {
            this.disableScrolling();
        }
    }

}

export default new DocumentState();
