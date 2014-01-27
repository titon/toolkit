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

        /* How many times the blackout has been opened */
        this.count = 0;

        /** The wrapping loader element */
        this.loader = null;

        /** The loading message element */
        this.message = null;

        this.initialize();
    });

    Toolkit.Blackout.options = {
        loader: 'bar-wave',
        loaderMessage: Toolkit.messages.loading,
        waveCount: 5,
        template: '<div class="' + Toolkit.options.vendor + 'blackout" id="toolkit-blackout"></div>',
        templateFrom: '#toolkit-blackout'
    };

    var Blackout = Toolkit.Blackout.prototype;

    /**
     * Create the loader and message elements.
     */
    Blackout.initialize = function() {
        var options = this.options,
            vendor = Toolkit.options.vendor,
            count = (options.loader === 'bubble-spinner') ? 8 : options.waveCount;

        this.loader = $('<div/>')
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
                .appendTo(this.loader);
        } else {
            this.loader.html(spans);
        }

        this.message = $('<div/>')
            .addClass(vendor + 'loader-message')
            .html(options.loaderMessage)
            .appendTo(this.loader);

        this.fireEvent('init');
    };

    /**
     * Hide the blackout.
     *
     * @returns {Toolkit.Blackout}
     */
    Blackout.hide = function() {
        var count = this.count - 1;

        if (count <= 0) {
            this.count = 0;
            this.element.conceal();
            this.hideLoader();
        } else {
            this.count = count;
        }

        this.fireEvent('hide', (count <= 0));

        return this;
    };

    /**
     * Hide the loader.
     *
     * @returns {Toolkit.Blackout}
     */
    Blackout.hideLoader = function() {
        this.loader.conceal();

        return this;
    };

    /**
     * Show the blackout.
     *
     * @returns {Toolkit.Blackout}
     */
    Blackout.show = function() {
        this.count++;
        this.element.reveal();

        this.showLoader();
        this.fireEvent('show');

        return this;
    };

    /**
     * Show the loader.
     *
     * @returns {Toolkit.Blackout}
     */
    Blackout.showLoader = function() {
        this.loader.reveal();

        return this;
    };

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