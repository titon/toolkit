/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Blackout = Toolkit.Component.extend(function(options) {
        this.component = 'Blackout';
        this.version = '1.2.0';
        this.options = options = this.setOptions(options);
        this.element = this.createElement();
        this.count = 0;

        // Build the loader
        var vendor = Toolkit.options.vendor,
            count = (options.loader === 'bubble-spinner') ? 8 : options.waveCount,
            loader = $('<div/>')
                .addClass(vendor + 'loader')
                .addClass(options.loader)
                .appendTo(this.element);

        // Create all the spans
        var spans = '', i;

        for (i = 0; i < count; i++) {
            spans += '<span></span>';
        }

        // Append to the loader
        if (options.loader === 'bubble-spinner') {
            $('<div/>')
                .addClass('spinner')
                .html(spans)
                .appendTo(loader);
        } else {
            loader.html(spans);
        }

        this.loader = loader;

        // Build the message
        this.message = $('<div/>')
            .addClass(vendor + 'loader-message')
            .html(Toolkit.messages.loading)
            .appendTo(loader);

        this.fireEvent('init');
    }, {

        /**
         * Hide the blackout if count reaches 0.
         */
        hide: function() {
            var count = this.count - 1;

            if (count <= 0) {
                this.count = 0;
                this.element.conceal();
                this.hideLoader();
            } else {
                this.count = count;
            }

            this.fireEvent('hide', (count <= 0));
        },

        /**
         * Hide the loader.
         */
        hideLoader: function() {
            this.loader.conceal();
            this.fireEvent('hideLoader');
        },

        /**
         * Show the blackout and increase open count.
         */
        show: function() {
            var show = false;

            this.count++;

            if (this.count === 1) {
                this.element.reveal();
                show = true;
            }

            this.showLoader();
            this.fireEvent('show', show);
        },

        /**
         * Show the loader.
         */
        showLoader: function() {
            this.loader.reveal();
            this.fireEvent('showLoader');
        }

    }, {
        loader: 'bar-wave',
        waveCount: 5,
        template: '<div class="' + Toolkit.options.vendor + 'blackout" id="toolkit-blackout"></div>',
        templateFrom: '#toolkit-blackout'
    });

    /** Has the blackout been created already? */
    var instance = null;

    /**
     * Only one instance of Blackout should exist,
     * so provide a factory method that stores the instance.
     *
     * @param {Object} [options]
     * @returns {Toolkit.Blackout}
     */
    Toolkit.Blackout.factory = function(options) {
        if (instance) {
            return instance;
        }

        return instance = new Toolkit.Blackout(options);
    };

})(jQuery);