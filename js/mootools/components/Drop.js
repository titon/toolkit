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
        this.nodes = elements;

        var events = {},
            selector = this.options.delegate,
            clickout = selector;

        // Initialize events
        ['down', 'up', 'left', 'right'].each(function(value) {
            clickout += ',.' + Toolkit.vendor + 'drop--' + value;
        });

        events['clickout ' + clickout] = 'hide';
        events[this.options.mode + ' ' + selector] = 'onShow';

        this.events = events;

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Hide the element and toggle node active state.
     *
     * @returns {Toolkit.Drop}
     */
    hide: function() {
        return this.parent(function() {
            this.node.removeClass('is-active');
        }.bind(this));
    },

    /**
     * Show the element and toggle node active state.
     *
     * @returns {Toolkit.Drop}
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
    onShow: function(e, node) {
        if (typeOf(e) === 'domevent') {
            e.preventDefault();
        }

        var target = this.readValue(node, this.options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        // Hide previous drops
        if (this.options.hideOpened && this.node && this.node !== node) {
            this.hide();
        }

        this.element = document.id(target.slice(1));
        this.node = node;

        if (!this.isVisible()) {
            this.show(node);
        } else {
            this.hide();
        }
    }

});

    /**
     * Defines a component that can be instantiated through drop().
     */
    Toolkit.createComponent('drop', function(options) {
        return new Toolkit.Drop(this, options);
    }, true);

})();