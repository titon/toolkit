/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import Component from 'Component';
import assign from 'lodash/object/assign';
import forOwn from 'lodash/object/forOwn';
import cast from 'extensions/utility/cast';

export default class EmbeddedComponent extends Component {

    /**
     * Generate a valid HTML data attribute CSS selector based on the current module name and namespace.
     *
     * @param {string} [element]
     * @param {string} [block]
     * @returns {string}
     */
    formatNamespace(element, block) {
        var selector = 'data-' + (block || this.getAttributeName());

        if (element) {
            selector += '-' + element;
        }

        if (this.namespace) {
            selector += '="' + this.namespace + '"';
        }

        return '[' + selector + ']';
    }

    /**
     * {@inheritdoc}
     */
    getDefaultOptions() {
        return EmbeddedComponent.options;
    }

    /**
     * Inherit option overrides from the primary element's data attributes.
     * If a `group` attribute is defined, attempt to inherit any options defined for that group.
     *
     * @returns {Object}
     */
    inheritOptions() {
        let options = this.options,
            attrPrefix = 'data-' + this.getAttributeName() + '-',
            attrValue;

        forOwn(this.baseOptions, (value, key) => {
            if (attrValue = this.element.getAttribute(attrPrefix + key)) {
                options[key] = cast(attrValue);
            }
        });

        // Inherit options if a group has been defined
        let group = this.element.getAttribute(attrPrefix + 'group');

        if (group && options.groups[group]) {
            assign(options, options.groups[group]);
        }

        this.options = options;
    }

    /**
     * Once the element has been set, we can attempt to inherit any data attributes as options.
     *
     * @param {HTMLElement|Element} element
     */
    setElement(element) {
        super.setElement(element);

        // Inherit options from attributes as they are entered manually in the DOM
        this.inheritOptions();
    }

    /**
     * {@inheritdoc}
     */
    setupProperties() {
        this.name = 'EmbeddedComponent';

        /** The element namespace to uniquely identify nested modules. */
        this.namespace = this.element.getAttribute('data-' + this.getAttributeName()) || this.options.namespace;
    }
}

EmbeddedComponent.options = {
    namespace: ''   // The fallback namespace if the data attribute approach is not used
};
