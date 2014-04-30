/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Modal = new Class({
    Extends: Toolkit.Component,
    Binds: ['onSubmit', 'onKeydown'],

    /** Blackout instance if options.blackout is true */
    blackout: null,

    /** Drag instance if options.draggable is true */
    drag: null,

    /** Body DOM element */
    elementBody: null,

    /** Default options */
    options: {
        delegate: '.js-modal',
        animation: 'fade',
        ajax: true,
        blackout: true,
        fullScreen: false,
        stopScroll: true,
        getContent: 'data-modal',
        template: '<div class="modal">' +
            '<div class="modal-outer">' +
                '<div class="modal-inner"></div>' +
                '<button class="modal-close modal-hide"><span class="x"></span></button>' +
            '</div>' +
        '</div>'
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.nodes = elements;
        this.createElement();

        options = this.options;

        if (options.fullScreen) {
            this.element.addClass('is-fullscreen');
        }

        // Blackout
        if (options.blackout) {
            this.blackout = Toolkit.Blackout.factory();

            if (options.stopScroll) {
                this.blackout.addEvent('hide', function(hidden) {
                    if (hidden) {
                        document.body.removeClass('no-scroll');
                    }
                });
            }
        }

        // Add aria attributes
        this.element
            .set('role', 'dialog')
            .aria('labelledby', this.id())
            .aria('describedby', this.id());

        this.events = {
            'keydown window': 'onKeydown',
            'clickout element': 'onHide',
            'clickout document {selector}': 'onHide',
            'click document {selector}': 'onShow',
            'click element .@modal-hide': 'onHide',
            'click element .@modal-submit': 'onSubmit'
        };

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Hide the modal.
     *
     * @returns {Toolkit.Modal}
     */
    hide: function() {
        if (this.blackout) {
            this.blackout.hide();
        }

        return this.parent();
    },

    /**
     * Position the modal in the center of the screen.
     *
     * @param {String|Element} content
     * @returns {Toolkit.Modal}
     */
    position: function(content) {
        // AJAX is currently loading
        if (content === true) {
            return this;
        }

        // Hide blackout loading message
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        var body = this.element.getElement('.' + vendor + 'modal-inner');

        body.set('html', content);
        this.fireEvent('load', content);

        // Reveal modal
        this.element.reveal();

        // Resize modal
        if (this.options.fullScreen) {
            body.setStyle('min-height', window.getHeight());
        }

        this.fireEvent('show');

        return this;
    },

    /**
     * Show the modal with the specific content.
     * If a node is passed, grab the modal AJAX URL or target element.
     * If content is passed, display it immediately.
     *
     * @param {Element} node
     * @param {String|Element} [content]
     * @returns {Toolkit.Modal}
     */
    show: function(node, content) {
        var options = this.options,
            ajax = options.ajax;

        // Get content
        if (content) {
            ajax = false;

        } else if (node) {
            this.node = node;

            ajax = this.readOption(node, 'ajax');
            content = this.readValue(node, this.readOption(node, 'getContent')) || node.get('href');

            if (content && content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                ajax = false;
            }
        }

        if (!content) {
            return this;
        }

        // Show blackout if the element is hidden
        // If it is visible, the blackout count will break
        if (this.blackout && !this.element.isShown()) {
            this.blackout.show();
        }

        if (options.stopScroll) {
            document.body.addClass('no-scroll');
        }

        // Fetch content
        if (ajax) {
            if (this.cache[content]) {
                this.position(this.cache[content]);
            } else {
                this.requestData(content);
            }
        } else {
            this.position(content);
        }

        return this;
    },

    /**
     * Event handler for closing the modal when esc is pressed.
     *
     * @private
     * @param {DOMEvent} e
     */
    onKeydown: function(e) {
        if (e.key === 'esc' && this.element.isShown()) {
            this.hide();
        }
    },

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {DOMEvent} e
     */
    onSubmit: function(e) {
        e.preventDefault();

        var button = e.target,
            form = this.element.getElement('form');

        if (!form) {
            return;
        }

        this.fireEvent('submit', [button, form]);

        var options = {
            url: form.get('action'),
            method: form.get('method').toUpperCase()
        };

        if (window.FormData) {
            options.data = new FormData(form);
        } else {
            options.data = form.toQueryString();
        }

        this.requestData(options);
    }

});

Toolkit.create('modal', function(options) {
    return new Toolkit.Modal(this, options);
}, true);