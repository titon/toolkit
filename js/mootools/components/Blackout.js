/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Blackout = new Class({
    Extends: Toolkit.Component,

    /* How many times the blackout has been opened */
    count: 0,

    /** The wrapping loader element */
    loader: null,

    /** The loading message element */
    message: null,

    /** Default options */
    options: {
        loader: 'bar-wave',
        loaderMessage: Toolkit.messages.loading,
        waveCount: 5,
        template: '<div class="' + Toolkit.options.vendor + 'blackout" id="toolkit-blackout"></div>',
        templateFrom: '#toolkit-blackout'
    },

    /**
     * Add events for browser resizing.
     *
     * @param {Object} [options]
     */
    initialize: function(options) {
        this.parent(options);
        this.createElement();
        this.createLoader();
        this.fireEvent('init');
    },

    /**
     * Create the loader and loading message.
     */
    createLoader: function() {
        var options = this.options,
            vendor = Toolkit.options.vendor,
            count = (options.loader === 'bubble-spinner') ? 8 : options.waveCount;

        this.loader = new Element('div.' + vendor + 'loader.' + options.loader)
            .inject(this.element);

        // Create all the spans
        var spans = '', i;

        for (i = 0; i < count; i++) {
            spans += '<span></span>';
        }

        // Append to the loader
        if (options.loader === 'bubble-spinner') {
            new Element('div.spinner')
                .set('html', spans)
                .inject(this.loader);
        } else {
            this.loader.set('html', spans);
        }

        this.message = new Element('div.' + vendor + 'loader-message')
            .set('html', options.loaderMessage)
            .inject(this.loader);
    },

    /**
     * Hide the blackout.
     *
     * @returns {Toolkit.Blackout}
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

        return this;
    },

    /**
     * Hide the loader.
     *
     * @returns {Toolkit.Blackout}
     */
    hideLoader: function() {
        this.loader.conceal();

        return this;
    },

    /**
     * Show the blackout.
     *
     * @returns {Toolkit.Blackout}
     */
    show: function() {
        this.count++;
        this.element.reveal();

        this.showLoader();
        this.fireEvent('show');

        return this;
    },

    /**
     * Show the loader.
     *
     * @returns {Toolkit.Blackout}
     */
    showLoader: function() {
        this.loader.reveal();

        return this;
    }

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

})();