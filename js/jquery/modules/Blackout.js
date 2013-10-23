/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Blackout = Titon.Component.create(function(options) {

    /** Custom options */
    this.options = this.setOptions({
        template: '<div class="blackout" id="titon-blackout"></div>',
        templateFrom: '#titon-blackout'
    }, options);

    /** Blackout element */
    this.element = this.createElement(this.options);

    /**
     * Add events for browser resizing.
     */
    this.initialize = function() {
        $(window).on('resize', this.position.bind(this));

        this.fireEvent('init');
    };

    /**
     * Hide the blackout.
     *
     * @returns {Titon.Blackout}
     */
    this.hide = function() {
        this.element.conceal();
        this.fireEvent('hide');

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
        this.fireEvent('show');

        return this;
    };

    // Initialize the class only if the element exists
    this.initialize();
});

})(jQuery);