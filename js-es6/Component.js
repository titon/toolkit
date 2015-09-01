/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Module from 'Module';
import memoize from 'decorators/memoize';

export default class Component extends Module {

    /**
     * Generate a unique HTML ID based on the passed parameters.
     *
     * @returns {string}
     */
    formatID(...params) {
        return ['titon', this.getCssClassName(), this.uid].concat(params).join('-');
    }

    /**
     * Return the module name as a valid HTML attribute name.
     *
     * @returns {string}
     */
    @memoize
    getAttributeName() {
        return this.name.toLowerCase();
    }

    /**
     * Return the module name as a valid CSS class name.
     * Will convert upper case characters to lower case prefixed with dashes.
     *
     * @returns {string}
     */
    @memoize
    getCssClassName() {
        return this.name.replace(/[A-Z]/g, match => '-' + match.toLowerCase()).slice(1);
    }

    /**
     * {@inheritdoc}
     */
    getDefaultOptions() {
        return Component.options;
    }

    /**
     * {@inheritdoc}
     */
    setupProperties() {
        this.name = 'Component';
    }

}

Component.options = {
    ajax: {},           // Settings to apply to AJAX requests
    context: null,      // The context in which to query the DOM
    className: ''       // Class name to append to the primary element
};
