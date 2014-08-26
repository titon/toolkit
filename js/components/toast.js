define([
    'jquery',
    './component',
    '../extensions/transitionend'
], function($, Toolkit) {

Toolkit.Toast = Toolkit.Component.extend({
    name: 'Toast',
    version: '1.5.0',

    /**
     * Initialize the toast.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.options = options = this.setOptions(options);
        this.element = this.createElement()
            .addClass(options.position)
            .removeClass(options.animation)
            .attr('role', 'log')
            .aria({
                relevant: 'additions',
                hidden: 'false'
            })
            .appendTo(element)
            .reveal();

        this.initialize();
    },

    /**
     * Create a toast element, insert content into it, and append it to the container.
     *
     * @param {*} content
     * @param {Object} [options]
     */
    create: function(content, options) {
        options = $.extend({}, this.options, options || {});

        var self = this,
            toast = $(options.toastTemplate)
                .addClass(options.animation)
                .attr('role', 'note')
                .html(content)
                .conceal()
                .prependTo(this.element);

        this.fireEvent('create', [toast]);

        // Set a timeout to trigger show transition
        setTimeout(function() {
            self.show(toast);
        }, 15); // IE needs a minimum of 15

        // Set a timeout to remove the toast
        if (options.duration) {
            setTimeout(function() {
                self.hide(toast);
            }, options.duration + 15);
        }
    },

    /**
     * Hide the toast after the duration is up.
     * Also remove the element from the DOM once the transition is complete.
     *
     * @param {jQuery} element
     */
    hide: function(element) {
        element = $(element);

        // Pass the element since it gets removed
        this.fireEvent('hiding', [element]);

        element.transitionend(function() {
            element.remove();
            this.fireEvent('hidden');
        }.bind(this)).conceal();
    },

    /**
     * Reveal the toast after it has been placed in the container.
     *
     * @param {jQuery} element
     */
    show: function(element) {
        element = $(element);

        this.fireEvent('showing', [element]);

        element.reveal();

        this.fireEvent('shown', [element]);
    }

}, {
    position: 'bottom-left',
    animation: 'slide-up',
    duration: 5000,
    template: '<aside class="toasts"></aside>',
    toastTemplate: '<div class="toast"></div>'
});

Toolkit.create('toast', function(options) {
    return new Toolkit.Toast(this, options);
});

return Toolkit;
});