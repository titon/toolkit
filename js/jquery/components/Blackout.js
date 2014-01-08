/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Blackout = Toolkit.Component.create(function(options) {
        this.component = 'Blackout';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Blackout.options, options);

        /** Blackout element */
        this.element = this.createElement(this.options);

        this.initialize();
    });

    Toolkit.Blackout.options = {
        template: '<div class="' + Toolkit.options.vendor + 'blackout" id="toolkit-blackout"></div>',
        templateFrom: '#toolkit-blackout'
    };

    var Blackout = Toolkit.Blackout.prototype;

    /**
     * Add events for browser resizing.
     */
    Blackout.initialize = function() {
        $(window).on('resize', this.position.bind(this));

        this.fireEvent('init');
    };

    /**
     * Hide the blackout.
     *
     * @returns {Toolkit.Blackout}
     */
    Blackout.hide = function() {
        this.element.conceal();
        this.fireEvent('hide');

        return this;
    };

    /**
     * Display and position the blackout.
     *
     * @returns {Toolkit.Blackout}
     */
    Blackout.position = function() {
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
     * @returns {Toolkit.Blackout}
     */
    Blackout.show = function() {
        this.element.reveal();
        this.position();
        this.fireEvent('show');

        return this;
    };

})(jQuery);