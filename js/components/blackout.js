/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './template-component'
], function($, Toolkit, TemplateComponent) {

/** Has the blackout been created already? */
var blackoutInstance = null;

var Blackout = Toolkit.Blackout = TemplateComponent.extend({
    name: 'Blackout',
    version: '2.0.0',

    /** How many times the blackout has been opened while being opened. */
    count: 0,

    /** The loader animation element. */
    loader: null,

    /** The message element. */
    message: null,

    /**
     * Create the blackout and loader elements.
     *
     * @param {Object} [options]
     */
    constructor: function(options) {
        options = this.setOptions(options);
        this.element = this.createElement();

        // Generate loader elements
        this.loader = this.render(options.loaderTemplate).appendTo(this.element);
        this.message = this.loader.find(this.ns('message', 'loader'));

        if (options.showLoading) {
            this.message.html(Toolkit.messages.loading);
        }

        // Initialize
        this.initialize();
    },

    /**
     * Remove the blackout element and reset instance.
     */
    destructor: function() {
        this.element.remove();
        blackoutInstance = null;
    },

    /**
     * Hide the blackout if count reaches 0.
     */
    hide: function() {
        this.fireEvent('hiding');

        var count = this.count - 1;

        if (count <= 0) {
            this.count = 0;
            this.element.conceal();
        } else {
            this.count = count;
        }

        this.hideLoader();

        this.fireEvent('hidden', [(count <= 0)]);
    },

    /**
     * Hide the loader.
     */
    hideLoader: function() {
        // There's an issue on Chrome where calling conceal() here doesn't work
        // when the blackout is being transitioned. So just change it's display.
        this.loader.hide();
    },

    /**
     * Show the blackout and increase open count.
     */
    show: function() {
        this.fireEvent('showing');

        var show = false;

        this.count++;

        if (this.count === 1) {
            this.element.reveal();
            show = true;
        }

        this.showLoader();

        this.fireEvent('shown', [show]);
    },

    /**
     * Show the loader.
     */
    showLoader: function() {
        // The same problem for hide() applies here, so just change the display.
        this.loader.show();
    }

}, {
    showLoading: true,
    template: function(bem) {
        return '<div class="' + bem('blackout') + '"></div>';
    },
    templateFrom: '#toolkit-blackout-1',
    loaderTemplate: function(bem) {
        return '<div class="' + bem('loader') + ' bar-wave">' +
            '<span></span><span></span><span></span><span></span><span></span>' +
            '<div class="' + bem('loader', 'message') + '" data-loader-message></div>' +
        '</div>';
    }
});

/**
 * Only one instance of Blackout should exist,
 * so provide a factory method that stores the instance.
 *
 * @param {Object} [options]
 * @returns {Toolkit.Blackout}
 */
Blackout.instance = function(options) {
    if (blackoutInstance) {
        return blackoutInstance;
    }

    return blackoutInstance = new Blackout(options);
};

return Blackout;
});
