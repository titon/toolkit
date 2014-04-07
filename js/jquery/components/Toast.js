/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Toast = Toolkit.Component.extend(function(element, options) {
    this.component = 'Toast';
    this.version = '1.4.0';
    this.options = options = this.setOptions(options);
    this.element = $('<aside class="toasts"></aside>')
        .addClass(options.position)
        .attr('role', 'log')
        .aria({
            relevant: 'additions',
            hidden: 'false'
        })
        .appendTo(element);

    this.initialize();
}, {

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
                .addClass(vendor + 'toast')
                .addClass(options.animation)
                .attr('role', 'note')
                .html(content)
                .conceal()
                .prependTo(this.element);

        this.fireEvent('create', toast);

        // Set a timeout to trigger show transition
        setTimeout(function() {
            self.show(toast);
        }, 5);

        // Set a timeout to remove the toast
        if (options.duration) {
            setTimeout(function() {
                self.hide(toast);
            }, options.duration + 5);
        }
    },

    /**
     * Hide the toast after the duration is up.
     * Also remove the element from the DOM once the transition is complete.
     *
     * @param {jQuery} element
     */
    hide: function(element) {
        this.fireEvent('hide', element); // Must be called first since the element gets removed

        element
            .on(transitionend, function(e) {
                // Do a check since transitionend gets called multiple times
                if (e.originalEvent.propertyName === 'visibility') {
                    $(this).remove();
                }
            })
            .conceal();
    },

    /**
     * Reveal the toast after it has been placed in the container.
     *
     * @param {jQuery} element
     */
    show: function(element) {
        element.reveal();

        this.fireEvent('show', element);
    }

}, {
    position: 'bottom-left',
    animation: 'slide-up',
    duration: 5000
});

Toolkit.create('toast', function(options) {
    return new Toolkit.Toast(this, options);
});