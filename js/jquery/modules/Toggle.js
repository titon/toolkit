/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Toggle = function(nodes, options) {

    /** Custom options */
    this.options = this.setOptions($.fn.toggle.options, options);

    /** List of elements to active toggle */
    this.nodes = $(nodes);

    /** Element to toggle */
    this.element = null;

    /** Currently active node */
    this.node = null;

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        $(window).on('click', this.hide.bind(this));
        $(this.options.context || document).on((this.options.mode === 'click' ? 'click' : 'mouseenter'), this.nodes.selector, this.__show.bind(this));
    };

    /**
     * Hide the opened element and remove active state.
     *
     * @returns {Titon.Toggle}
     */
    this.hide = function() {
        if (this.element.is(':shown')) {
            this.element.conceal();
            this.node.removeClass('is-active');
        }

        return this;
    };

    /**
     * Open the target element and apply active state.
     *
     * @param {jQuery} node
     * @returns {Titon.Toggle}
     */
    this.show = function(node) {
        this.element.reveal();
        this.node = $(node);
        this.node.addClass('is-active');

        return this;
    };

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @private
     * @param {Event} e
     */
    this.__show = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.enabled) {
            return;
        }

        var node = $(e.target),
            target = this.readValue(node, this.options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        if (this.options.hideOpened && this.node && this.node.get(0) !== node.get(0)) {
            this.hide();
        }

        this.element = $(target);

        if (!this.element.is(':shown')) {
            this.show(node);
        } else {
            this.hide();
        }
    };

    // Initialize the class only if elements exists
    this.initialize();
};

Titon.Accordion.prototype = new Titon.Component();
Titon.Accordion.prototype.constructor = Titon.Component;

/**
 * Enable dropdowns on Elements collections by calling dropdown().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('.js-dropdown').dropdown({
 *         hideOpened: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Toggle}
 */
$.fn.dropdown = function(options) {
    if (this.$dropdown) {
        return this.$dropdown;
    }

    this.$dropdown = new Titon.Toggle(this, options);

    return this.$dropdown;
};

$.fn.toggle.options = {
    mode: 'click',
    context: null,
    getTarget: 'data-toggle',
    hideOpened: true
};

})(jQuery);