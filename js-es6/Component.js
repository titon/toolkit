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
        params.unshift('titon', this.getCssClassName(), this.uid);

        return params.join('-');
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
     * Will convert upper case characters to lower case dashes.
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
    setupProperties() {
        this.name = 'Component';
    }

}

Component.options = {
    ajax: {},
    context: null,
    className: ''
};
