/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Toggle = function(elements, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.toggle.options, options);

    /** Element to toggle */
    this.element = null;

    /** List of elements to active toggle */
    this.nodes = Titon.setElement(elements, this.options);

    /** Currently active node */
    this.node = null;

    /**
     * Initialize toggle events.
     */
    this.initialize = function() {
        this.disable().enable();

        $(window).on('click', this.hide.bind(this));
    };

    /**
     * Disable events.
     *
     * @returns {Titon.Toggle}
     */
    this.disable = function() {
        $(this.options.context || document).off((this.options.mode === 'click' ? 'click' : 'mouseenter'), this.nodes.selector, this._show.bind(this));

        return this;
    };

    /**
     * Enable events.
     *
     * @returns {Titon.Toggle}
     */
    this.enable = function() {
        $(this.options.context || document).on((this.options.mode === 'click' ? 'click' : 'mouseenter'), this.nodes.selector, this._show.bind(this));

        return this;
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
    this._show = function(e) {
        e.preventDefault();
        e.stopPropagation();

        var node = $(e.target),
            target = Titon.getValue.apply(this, [node, this.options.getTarget]);

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
    if (this.nodes.length) {
        this.initialize();
    }
};

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