/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Toggle = new Class({
    Extends: Titon.Component,

    /** Default options */
    options: {
        getTarget: 'data-toggle',
        hideOpened: true
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.setNodes(elements);

        window.addEvent('click', this.hide.bind(this));

        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Hide the element and toggle node active state.
     *
     * @returns {Titon.Toggle}
     */
    hide: function() {
        return this.parent(function() {
            this.node.removeClass('is-active');
        }.bind(this));
    },

    /**
     * Show the element and toggle node active state.
     *
     * @returns {Titon.Toggle}
     */
    show: function(node) {
        this.parent(node);
        this.node.addClass('is-active');

        return this;
    },

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @private
     * @param {DOMEvent} e
     * @param {Element} node
     */
    __show: function(e, node) {
        if (typeOf(e) === 'domevent') {
            e.stop();
        }

        if (!this.enabled) {
            return;
        }

        var target = this.readValue(node, this.options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        if (this.options.hideOpened && this.node && this.node !== node) {
            this.hide();
        }

        this.setElement(target);

        if (!this.isVisible()) {
            this.show(node);
        } else {
            this.hide();
        }
    }

});

/**
 * Enable dropdowns on Elements collections by calling dropdown().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $$('.js-dropdown').dropdown({
 *         hideOpened: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Toggle}
 */
Elements.implement('dropdown', function(options) {
    options = options || {};
    options.delegate = options.delegate || '.js-dropdown';

    var dropdown = new Titon.Toggle(this, options);

    return this.each(function(el) {
        if (!el.$dropdown) {
            el.$dropdown = dropdown;
        }
    });
});

})();