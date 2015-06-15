/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './composite-component',
    '../extensions/transitionend'
], function($, Toolkit, CompositeComponent) {

var Toast = Toolkit.Toast = CompositeComponent.extend({
    name: 'Toast',
    version: '2.1.0',

    /**
     * Initialize the toast.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        this.nodes = element = $(element); // Set to nodes so instances are unset during destroy()
        options = this.setOptions(options, element);

        // Create the toasts wrapper
        this.createWrapper()
            .addClass(options.position)
            .attr('role', 'log')
            .aria({
                relevant: 'additions',
                hidden: 'false'
            });

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
            toast = this.render(options.template)
                .addClass(options.animation)
                .attr('role', 'note')
                .html(content)
                .conceal()
                .prependTo(this.wrapper);

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
    wrapperClass: function(bem) {
        return bem('toasts');
    },
    template: function(bem) {
        return '<div class="' + bem('toast') + '"></div>';
    }
});

Toolkit.createPlugin('toast', function(options) {
    return new Toast(this, options);
});

return Toast;
});
