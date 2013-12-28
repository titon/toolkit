/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Drop = new Class({
    Extends: Toolkit.Component,

    /** Default options */
    options: {
        delegate: '.js-drop',
        getTarget: 'data-drop',
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

        $$(this.options.delegate + ', .drop--down, .drop--up, .drop--left, .drop--right')
            .addEvent('clickout', this.hide.bind(this));

        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Hide the element and toggle node active state.
     *
     * @returns {Toolkit.Drop}
     */
    hide: function() {
        return this.parent(function() {
            this.node.removeClass(Toolkit.options.isPrefix + 'active');
        }.bind(this));
    },

    /**
     * Show the element and toggle node active state.
     *
     * @returns {Toolkit.Drop}
     */
    show: function(node) {
        this.parent(node);
        this.node.addClass(Toolkit.options.isPrefix + 'active');

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
            e.preventDefault();
        }

        if (!this.enabled) {
            return;
        }

        var target = this.readValue(node, this.options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        // Hide previous drops
        if (this.options.hideOpened && this.node && this.node !== node) {
            this.hide();
        }

        this.setElement(target);
        this.node = node;

        if (!this.isVisible()) {
            this.show(node);
        } else {
            this.hide();
        }
    }

});

/**
 * Enable drop's on Elements collections by calling drop().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $$('.js-drop').drop({
 *         hideOpened: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Toolkit.Drop}
 */
Elements.implement('drop', function(options) {
    var drop = new Toolkit.Drop(this, options);

    return this.each(function(el) {
        if (!el.$drop) {
            el.$drop = drop;
        }
    });
});

})();