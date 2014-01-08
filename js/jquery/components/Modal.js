/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Modal = Toolkit.Component.create(function(nodes, options) {
        this.component = 'Modal';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Modal.options, options);

        /** List of elements to active modals */
        this.nodes = $(nodes);

        /** Currently active node */
        this.node = null;

        /** Modal element */
        this.element = this.createElement(this.options);

        /** Modal body element */
        this.elementBody = null;

        /** Blackout instance if options.blackout is true */
        this.blackout = null;

        /** Drag instance if options.draggable is true */
        this.drag = null;

        /** Cache requests */
        this.cache = {};

        this.initialize();
    });

    Toolkit.Modal.options = {
        animation: 'fade',
        className: '',
        context: null,
        ajax: true,
        draggable: false,
        blackout: true,
        showLoading: true,
        fullScreen: false,
        getContent: 'data-modal',
        contentElement: '.modal-inner',
        closeElement: '.modal-close',
        closeEvent: '.modal-event-close',
        submitEvent: '.modal-event-submit',
        template: '<div class="modal">' +
            '<div class="modal-handle">' +
                '<div class="modal-inner"></div>' +
                '<a href="javascript:;" class="modal-close modal-event-close"><span class="x"></span></a>' +
            '</div>' +
        '</div>'
    };

    var Modal = Toolkit.Modal.prototype;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    Modal.initialize = function() {
        var options = this.options;

        if (options.fullScreen) {
            this.element.addClass(Toolkit.options.isPrefix + 'fullscreen');
            options.draggable = false;
        }

        this.elementBody = this.element.find(options.contentElement);

        // Draggable
        if (options.draggable && $.ui && $.ui.draggable) {
            this.drag = this.element.draggable({
                appendTo: 'body',
                containment: 'window',
                cursor: 'grabbing',
                start: function(e, ui) {
                    ui.helper.addClass(Toolkit.options.isPrefix + 'dragging');
                },
                stop: function(e, ui) {
                    ui.helper.removeClass(Toolkit.options.isPrefix + 'dragging');
                }
            });

            this.element.addClass(Toolkit.options.isPrefix + 'draggable');
        }

        // Blackout
        if (options.blackout) {
            this.blackout = new Toolkit.Blackout();
        }

        // Set events
        this.element.clickout(this.__hide.bind(this));
        this.nodes.clickout(this.__hide.bind(this));

        $(options.context || document)
            .on('click', this.nodes.selector, this.__show.bind(this));

        $(window).on('keydown', function(e) {
            if (e.keyCode === 27 /*esc*/ && this.element.is(':shown')) {
                this.hide();
            }
        }.bind(this));

        this.element
            .on('click', options.closeEvent, this.__hide.bind(this))
            .on('click', options.submitEvent, this.__submit.bind(this));

        this.fireEvent('init');
    };

    /**
     * Hide the modal and reset relevant values.
     *
     * @returns {Toolkit.Modal}
     */
    Modal.hide = function() {
        this.element.conceal();

        if (this.options.blackout) {
            this.blackout.hide();
        }

        this.fireEvent('hide');

        return this;
    };

    /**
     * Position the modal in the center of the screen.
     *
     * @param {String|jQuery} content
     * @returns {Toolkit.Modal}
     */
    Modal.position = function(content) {
        // AJAX is currently loading
        if (content === true) {
            return this;
        }

        this.elementBody.html(content);
        this.fireEvent('load', content);

        if (!this.element.is(':shown')) {
            if (this.options.blackout) {
                this.blackout.show();
            }

            if (this.options.fullScreen) {
                this.element.find(this.options.contentElement).css('min-height', $(window).height());
            }

            this.element.reveal();

            // IE8
            if (Toolkit.ie8 && !this.options.fullScreen) {
                this.element.css({
                    'margin-left': -(this.element.outerWidth(true) / 2),
                    'margin-top': -(this.element.outerHeight(true) / 2)
                });
            }
        }

        this.fireEvent('show');

        return this;
    };

    /**
     * Show the modal with the specific content.
     * If a node is passed, grab the modal AJAX URL or target element.
     * If content is passed, display it immediately.
     *
     * @param {jQuery} node
     * @param {String} [content]
     * @returns {Toolkit.Modal}
     */
    Modal.show = function(node, content) {
        node = $(node);

        var options = this.options,
            preAjaxValue = options.ajax;

        // Get content
        if (content) {
            options.ajax = false;

        } else if (node) {
            content = this.readValue(node, options.getContent) || node.attr('href');

            if (content && content.substr(0, 1) === '#') {
                content = $(content).html();
                options.ajax = false;
            }
        }

        if (!content) {
            return this;
        }

        this.node = node;

        if (options.ajax) {
            if (this.cache[content]) {
                this.position(this.cache[content]);
            } else {
                this.requestData('modal', content);
            }
        } else {
            this.position(content);
        }

        // Reset back to original state
        this.options.ajax = preAjaxValue;

        return this;
    };

    /**
     * Event handler for hide().
     *
     * @private
     * @param {Event} e
     */
    Modal.__hide = function(e) {
        e.preventDefault();

        this.hide();
    };

    /**
     * Event handler for show().
     *
     * @private
     * @param {Event} e
     */
    Modal.__show = function(e) {
        e.preventDefault();

        if (!this.enabled) {
            return;
        }

        this.show(e.currentTarget);
    };

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {Event} e
     */
    Modal.__submit = function(e) {
        e.preventDefault();

        var button = $(e.target),
            form = this.elementBody.find('form:first');

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

        this.requestData('modal', options);
    };

    /**
     * Enable modals on Elements collections by calling modal().
     * An object of options can be passed as the 1st argument.
     * The class instance will be cached and returned from this function.
     *
     * @example
     *     $('.js-modal').modal({
     *         draggable: true
     *     });
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.modal = function(options) {
        console.log(this, options);

        var modal = new Toolkit.Modal(this, options);

        return this.each(function() {
            $(this).addData('toolkit.modal', modal);
        });
    };

})(jQuery);