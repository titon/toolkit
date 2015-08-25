/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Component from 'Component';
import Element from 'Element';
import findID from 'extensions/dom/findID';

export default class EmbeddedComponent extends Component {

    /**
     * {@inheritdoc}
     */
    setupElement(selector) {
        let element = findID(selector);

        if (element instanceof Element) {
            this.setElement(element);
        } else {
            console.warn(`Element \`${selector}\` could not be found for ${this.name}.`);
        }
    }

    /**
     * {@inheritdoc}
     */
    setupProperties() {
        this.name = 'EmbeddedComponent';

        /** The element namespace to uniquely identify nested modules. */
        this.namespace = this.element.getAttribute('data-' + this.getAttributeName()) || '';
    }

    /**
     * Generate a valid HTML data attribute CSS selector based on the current module name and namespace.
     *
     * @param {string} [element]
     * @param {string} [block]
     * @returns {string}
     */
    buildNamespace(element, block) {
        var selector = 'data-' + (block || this.getAttributeName());

        if (element) {
            selector += '-' + element;
        }

        if (this.namespace) {
            selector += '="' + this.namespace + '"';
        }

        return '[' + selector + ']';
    }

}
