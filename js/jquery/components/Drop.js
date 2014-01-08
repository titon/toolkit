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

        /** Custom options */
        this.options = this.setOptions(Toolkit.Drop.options, options);

        /** Currently active node */
        this.node = null;

        /** List of elements to active drop */
        this.nodes = $(nodes);

        /** Element to toggle */
        this.element = null;

        this.initialize();
    });

    Toolkit.Drop.options = {
        mode: 'click',
        context: null,
        getTarget: 'data-drop',
        hideOpened: true
    };

    var Drop = Toolkit.Drop.prototype;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    Drop.initialize = function() {
        var selectors = ['down', 'up', 'left', 'right'].map(function(value) {
            return '.' + Toolkit.options.vendor + 'drop--' + value;
        });

        $(this.nodes.selector + ', ' + selectors.join(', '))
            .clickout(this.hide.bind(this));

        $(this.options.context || document)
            .on((this.options.mode === 'click' ? 'click' : 'mouseenter'), this.nodes.selector, this.__show.bind(this));

        this.fireEvent('init');
    };

    /**
     * Hide the opened element and remove active state.
     *
     * @returns {Toolkit.Drop}
     */
    Drop.hide = function() {
        if (this.element && this.element.is(':shown')) {
            this.element.conceal();
            this.node.removeClass(Toolkit.options.isPrefix + 'active');

            this.fireEvent('hide');
        }

        return this;
    };

    /**
     * Open the target element and apply active state.
     *
     * @param {jQuery} node
     * @returns {Toolkit.Drop}
     */
    Drop.show = function(node) {
        this.element.reveal();

        this.node = $(node);
        this.node.addClass(Toolkit.options.isPrefix + 'active');

        this.fireEvent('show');

        return this;
    };

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @private
     * @param {Event} e
     */
    Drop.__show = function(e) {
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
    };

    /**
     * Enable drop's on Elements collections by calling drop().
     * An object of options can be passed as the 1st argument.
     * The class instance will be cached and returned from this function.
     *
     * @example
     *     $('.js-drop').drop({
     *         hideOpened: true
     *     });
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.drop = function(options) {
        var drop = new Toolkit.Drop(this, options);

        return this.each(function() {
            $(this).addData('toolkit.drop', drop);
        });
    };

})(jQuery);