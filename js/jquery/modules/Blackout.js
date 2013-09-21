/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Blackout = function(options) {

    /** Custom options */
    this.options = Titon.setOptions({
        template: '<div class="blackout" id="titon-blackout"></div>',
        templateFrom: '#titon-blackout'
    }, options);

    /** Blackout element */
    this.element = Titon.createElement(this.options);

    /**
     * Add events for browser resizing.
     */
    this.initialize = function() {
        $(window).on('resize', this.position.bind(this));
    };

    /**
     * Hide the blackout.
     *
     * @returns {Titon.Blackout}
     */
    this.hide = function() {
        this.element.conceal();

        return this;
    };

    /**
     * Display and position the blackout.
     *
     * @returns {Titon.Blackout}
     */
    this.position = function() {
        if (this.element.is(':shown')) {
            var win = $(window);

            this.element.css({
                width: win.width(),
                height: win.height()
            });
        }

        return this;
    };

    /**
     * Show the blackout.
     *
     * @returns {Titon.Blackout}
     */
    this.show = function() {
        this.element.reveal();
        this.position();

        return this;
    };

    // Initialize the class only if the element exists
    this.initialize();
};

})(jQuery);