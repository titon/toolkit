/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Drop = Toolkit.Component.create(function(nodes, options) {
        this.component = 'Drop';
        this.version = '0.0.0';

        // Set options
        this.options = options = this.setOptions(options);

        // Element to toggle
        this.element = null;

        // Currently active node
        this.node = null;

        // List of elements to active drop
        this.nodes = nodes = $(nodes);

        // Set events
        var selectors = ['down', 'up', 'left', 'right'].map(function(value) {
            return '.' + Toolkit.options.vendor + 'drop--' + value;
        });

        $(nodes.selector + ', ' + selectors.join(', '))
            .clickout(this.hide.bind(this));

        $(options.context || document)
            .on((options.mode === 'click' ? 'click' : 'mouseenter'), nodes.selector, this.__show.bind(this));

        this.fireEvent('init');
    }, {

        /**
         * Hide the opened element and remove active state.
         *
         * @returns {Toolkit.Drop}
         */
        hide: function() {
            if (this.element && this.element.is(':shown')) {
                this.element.conceal();
                this.node.removeClass(Toolkit.options.isPrefix + 'active');

                this.fireEvent('hide');
            }

            return this;
        },

        /**
         * Open the target element and apply active state.
         *
         * @param {jQuery} node
         * @returns {Toolkit.Drop}
         */
        show: function(node) {
            this.element.reveal();

            this.node = $(node);
            this.node.addClass(Toolkit.options.isPrefix + 'active');

            this.fireEvent('show');

            return this;
        },

        /**
         * When a node is clicked, grab the target from the attribute.
         * Validate the target element, then either display or hide.
         *
         * @private
         * @param {Event} e
         */
        __show: function(e) {
            e.preventDefault();

            if (!this.enabled) {
                return;
            }

            var node = $(e.target),
                target = this.readValue(node, this.options.getTarget);

            if (!target || target.substr(0, 1) !== '#') {
                return;
            }

            // Hide previous drops
            if (this.options.hideOpened && this.node && !this.node.is(node)) {
                this.hide();
            }

            this.element = $(target);
            this.node = node;

            if (!this.element.is(':shown')) {
                this.show(node);
            } else {
                this.hide();
            }
        }

    }, {
        mode: 'click',
        context: null,
        getTarget: 'data-drop',
        hideOpened: true
    });

    /**
     * Defines a component that can be instantiated through drop().
     */
    Toolkit.createComponent('drop', function(options) {
        return new Toolkit.Drop(this, options);
    }, true);

})(jQuery);