/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import assign from 'lodash/assign';

const body = document.body;
const state = {
    scrollable: true
};

class DocumentState {

    /**
     * Disable document scrolling by adding a class to the body.
     */
    disableScrolling() {
        if (state.scrollable) {
            body.classList.add('no-scroll');
            state.scrollable = false;
        }
    }

    /**
     * Enable document scrolling by removing a class to the body.
     */
    enableScrolling() {
        if (!state.scrollable) {
            body.classList.remove('no-scroll');
            state.scrollable = true;
        }
    }

    /**
     * Return an immutable object of the current document state.
     *
     * @returns {Object}
     */
    getState() {
        return Object.freeze(assign({}, state));
    }

}

export default new DocumentState();
