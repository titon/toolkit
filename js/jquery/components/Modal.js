/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Modal = Toolkit.Component.extend(function(nodes, options) {
    var element;

    this.component = 'Modal';
    this.version = '1.3.0';
    this.options = options = this.setOptions(options);
    this.element = element = this.createElement()
        .attr('role', 'dialog')
        .aria('labelledby', this.id('title'))
        .aria('describedby', this.id('content'));

    // Enable fullscreen
    if (options.fullScreen) {
        element.addClass('is-fullscreen');
    }

    // Nodes found in the page on initialization
    this.nodes = nodes = $(nodes);

    // Last node to open a modal
    this.node = null;

    // Blackout element if enabled
    this.blackout = options.blackout ? Toolkit.Blackout.factory() : null;

    if (options.blackout && options.stopScroll) {
        this.blackout.element.on('hide.toolkit.blackout', function(e, hidden) {
            if (hidden) {
                $('body').removeClass('no-scroll');
            }
        });
    }

    // Initialize events
    this.events = {
        'clickout element': 'onHide',
        'keydown window': 'onKeydown',
        'click element .modal-event-close': 'onHide',
        'click element .modal-event-submit': 'onSubmit'
    };

    this.events['clickout ' + nodes.selector] = 'onHide';
    this.events['click ' + nodes.selector] = 'onShow';

    this.enable();
    this.fireEvent('init');
}, {

    /**
     * Hide the modal and reset relevant values.
     */
    hide: function() {
        this.element.conceal();

        if (this.blackout) {
            this.blackout.hide();
        }

        this.fireEvent('hide');
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

        var body = this.element.find('.' + vendor + 'modal-inner');

        body.html(content);
        this.fireEvent('load', content);

        // Reveal modal
        this.element.reveal();

        // Resize modal
        if (this.options.fullScreen) {
            body.css('min-height', $(window).height());
        }

        this.fireEvent('show');
    },

    /**
     * Show the modal with the specific content.
     * If a node is passed, grab the modal AJAX URL or target element.
     * If content is passed, display it immediately.
     *
     * @param {jQuery} node
     * @param {String} [content]
     */
    show: function(node, content) {
        var options = this.options,
            ajax = options.ajax;

        // Get content
        if (content) {
            ajax = false;

        } else if (node) {
            this.node = node = $(node);

            ajax = this.readOption(node, 'ajax');
            content = this.readValue(node, this.readOption(node, 'getContent')) || node.attr('href');

            if (content && content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                content = $(content).html();
                ajax = false;
            }
        }

        if (!content) {
            return;
        }

        // Show blackout if the element is hidden
        // If it is visible, the blackout count will break
        if (this.blackout && !this.element.is(':shown')) {
            this.blackout.show();
        }

        if (options.stopScroll) {
            $('body').addClass('no-scroll');
        }

        if (ajax) {
            if (this.cache[content]) {
                this.position(this.cache[content]);
            } else {
                this.requestData(content);
            }
        } else {
            this.position(content);
        }
    },

    /**
     * Event handler for hide().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onHide: function(e) {
        e.preventDefault();

        var element = this.element;

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
     * Event handler for show().
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        e.preventDefault();

        this.show(e.currentTarget);
    },

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onSubmit: function(e) {
        e.preventDefault();

        var button = $(e.currentTarget),
            form = this.element.find('form:first');

        if (!form) {
            return;
        }

        this.fireEvent('submit', [button, form]);

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
    }

}, {
    animation: 'fade',
    ajax: true,
    draggable: false,
    blackout: true,
    fullScreen: false,
    stopScroll: true,
    getContent: 'data-modal',
    template: '<div class="modal">' +
        '<div class="modal-outer">' +
            '<div class="modal-handle">' +
                '<div class="modal-inner"></div>' +
                '<button type="button" class="modal-close modal-event-close"><span class="x"></span></button>' +
            '</div>' +
        '</div>' +
    '</div>'
});

/**
 * Defines a component that can be instantiated through modal().
 */
Toolkit.create('modal', function(options) {
    return new Toolkit.Modal(this, options);
}, true);