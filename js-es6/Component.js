/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Module from 'Module';
import memoize from 'decorators/memoize';

export default class Component extends Module {

    /**
     * {@inheritdoc}
     */
    setupProperties() {
        this.name = 'Component';
    }

    /**
     * Generate a unique HTML ID based on the passed parameters.
     *
     * @returns {string}
     */
    buildID(...params) {
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
        return this.name.replace(/[A-Z]/g, match => ('-' + match.charAt(0).toLowerCase()).slice(1));
    }

}
