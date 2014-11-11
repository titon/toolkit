define([
    'jquery',
    './component',
    '../flags/vendor',
    '../events/clickout',
    '../extensions/shown-selector'
], function($, Toolkit, vendor) {

Toolkit.Modal = Toolkit.Component.extend({
    name: 'Modal',
    version: '1.5.2',

    /** Blackout element if enabled. */
    blackout: null,

    /**
     * Initialize the modal.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.options = options = this.setOptions(options);
        this.element = this.createElement()
            .attr('role', 'dialog')
            .aria('labelledby', this.id('title'))
            .aria('describedby', this.id('content'));

        // Enable fullscreen
        if (options.fullScreen) {
            this.element.addClass('is-fullscreen');
        }

        // Nodes found in the page on initialization
        this.nodes = $(nodes);

        if (options.blackout) {
            this.blackout = Toolkit.Blackout.instance();

            if (options.stopScroll) {
                this.blackout.addHook('hidden', function(hidden) {
                    if (hidden) {
                        $('body').removeClass('no-scroll');
                    }
                });
            }
        }

        // Initialize events
        this.events = {
            'keydown window': 'onKeydown',
            'clickout element': 'onHide',
            'clickout document {selector}': 'onHide',
            'click document {selector}': 'onShow',
            'click element': 'onHide',
            'click element [data-modal-close]': 'hide',
            'click element [data-modal-submit]': 'onSubmit'
        };

        this.initialize();
    },

    /**
     * Hide the modal and reset relevant values.
     */
    hide: function() {
        this.fireEvent('hiding');

        this.element.conceal();

        if (this.blackout) {
            this.blackout.hide();
        }

        this.fireEvent('hidden');
    },

    /**
     * Position the modal in the center of the screen.
     *
     * @param {String|jQuery} content
     */
    position: function(content) {
        // AJAX is currently loading
        if (content === true) {
            return;
        }

        // Hide blackout loading message
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        this.fireEvent('showing');

        var body = this.element.find(this.ns('content'));
            body.html(content);

        this.fireEvent('load', [content]);

        // Reveal modal
        this.element.reveal();

        // Resize modal
        if (this.options.fullScreen) {
            body.css('min-height', $(window).height());
        }

        this.fireEvent('shown');
    },

    /**
     * Show the modal with the specified content.
     *
     * @param {jQuery} node
     * @param {String} [content]
     */
    show: function(node, content) {
        if (node) {
            this.node = node = $(node);

            if (!content) {
                content = this.readValue(node, this.readOption(node, 'getContent')) || node.attr('href');
            }
        }

        // Show blackout if the element is hidden
        // If it is visible, the blackout count will break
        if (this.blackout && !this.element.is(':shown')) {
            this.blackout.show();
        }

        // Restrict scrolling
        if (this.options.stopScroll) {
            $('body').addClass('no-scroll');
        }

        this.loadContent(content);
    },

    /**
     * Submit the form found within the modal.
     */
    submit: function() {
        var form = this.element.find('form:first');

        if (!form) {
            return;
        }

        this.fireEvent('submit', [form]);

        var options = {
            url: form.attr('action'),
            type: (form.attr('method') || 'post').toUpperCase()
        };

        if (window.FormData) {
            options.processData = false;
            options.contentType = false;
            options.data = new FormData(form[0]);
        } else {
            options.data = form.serialize();
        }

        this.requestData(options);
    },

    /**
     * Event handler for hide().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onHide: function(e) {
        var element = this.element;

        // Since the modal element covers the entire viewport, we can't trigger the `clickout` event
        // So instead we have to bind a click event to the outer modal element to hide it
        // This should not trigger if a child element is clicked
        if (e.type === 'click' && !$(e.target).is(element)) {
            return;
        }

        e.preventDefault();

        // If the modal is loading (AJAX) or is not shown, exit early
        // This stops cases where the blackout can be clicked early
        if (!element.is(':shown') || element.hasClass('is-loading')) {
            return;
        }

        this.hide();
    },

    /**
     * Event handler for closing the modal when esc is pressed.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onKeydown: function(e) {
        if (e.keyCode === 27 /*esc*/ && this.element.is(':shown')) {
            this.hide();
        }
    },

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onSubmit: function(e) {
        e.preventDefault();

        this.submit();
    }

}, {
    animation: 'fade',
    ajax: true,
    blackout: true,
    fullScreen: false,
    stopScroll: true,
    getContent: 'data-modal',
    template: '<div class="' + vendor + 'modal">' +
        '<div class="' + vendor + 'modal-outer">' +
            '<div class="' + vendor + 'modal-inner" data-modal-content></div>' +
            '<button class="' + vendor + 'modal-close" data-modal-close><span class="x"></span></button>' +
        '</div>' +
    '</div>'
});

Toolkit.create('modal', function(options) {
    return new Toolkit.Modal(this, options);
}, true);

return Toolkit;
});