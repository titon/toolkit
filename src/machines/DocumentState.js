/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Titon from '../Titon';
import bind from '../decorators/bind';
import once from '../decorators/once';

const body = document.body;
const blackout = document.createElement('div');
const state = {
    lockedScrolls: 0,
    openedBlackouts: 0
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
        if (state.lockedScrolls === 0) {
            body.classList.add('no-scroll');
        }

        state.lockedScrolls++;
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
        if (!state.lockedScrolls) {
            return;
        }

        state.lockedScrolls--;

        if (state.lockedScrolls === 0) {
            body.classList.remove('no-scroll');
        }
    }

    /**
     * Return an immutable object of the current document state.
     *
     * @returns {Object}
     */
    getState() {
        return {
            scrollable: (state.lockedScrolls === 0),
            blackened: (state.openedBlackouts > 0)
        };
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
        if (!state.openedBlackouts) {
            return;
        }

        state.openedBlackouts--;

        if (state.openedBlackouts === 0) {
            blackout.addEventListener('transitionend', this.handleOnBlackoutHide);
            blackout.classList.remove('is-expanded');
        }
    }

    /**
     * Show the blackout and inject markup within (for loading states, etc).
     * The markup can be a string, an HTML element, or a React element.
     *
     * @param {String|HTMLElement|ReactElement} [content]
     */
    showBlackout(content) {
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

        if (state.openedBlackouts === 0) {
            blackout.classList.add('is-expanded');
        }

        state.openedBlackouts++;
    }

    /**
     * Show the blackout if the condition evaluates to true, else hide it.
     *
     * @param {Boolean} condition
     * @param {String|HTMLElement|ReactElement} [content]
     */
    toggleBlackout(condition, content = '') {
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

    /**
     * Update the hash in the address bar without causing a page jump.
     *
     * @param {String} hash
     */
    updateFragment(hash) {
        history.replaceState({ fragment: hash }, document.title, '#' + hash);
    }
}

export default new DocumentState();
