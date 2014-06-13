define([
    './component',
    '../extensions/transitionend'
], function(Toolkit) {

Toolkit.Toast = Toolkit.Component.extend({
    name: 'Toast',
    version: '1.5.0',

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
            toast = $('<div/>')
                .addClass(Toolkit.vendor + 'toast')
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

        this.fireEvent('hide', [element]); // Must be called first since the element gets removed

        element.transitionend(function() {
            $(this).remove();
        }).conceal();
    },

    /**
     * Reveal the toast after it has been placed in the container.
     *
     * @param {jQuery} element
     */
    show: function(element) {
        element = $(element);
        element.reveal();

        this.fireEvent('show', [element]);
    }

}, {
    position: 'bottom-left',
    animation: 'slide-up',
    duration: 5000,
    template: '<aside class="toasts"></aside>'
});

Toolkit.create('toast', function(options) {
    return new Toolkit.Toast(this, options);
});

return Toolkit;
});