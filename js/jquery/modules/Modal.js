/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Modal = function(nodes, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.modal.options, options);

    /** List of elements to active modals */
    this.nodes = $(nodes);

    /** Currently active node */
    this.node = null;

    /** Modal element */
    this.element = Titon.createElement(this.options);

    /** Modal body element */
    this.elementBody = null;

    /** Blackout instance if options.blackout is true */
    this.blackout = null;

    /** Cache requests */
    this.cache = {};

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize elements and attach events.
     */
    this.initialize = function() {
        var options = this.options;

        this.elementBody = this.element.find(options.contentElement);

        // Blackout
        if (options.blackout) {
            this.blackout = new Titon.Blackout();
            this.blackout.element.on('click', this.__hide.bind(this));
        }

        // Set events
        $(options.context || document)
            .on('click', this.nodes.selector, this.__show.bind(this));

        $(window).on('keydown', function(e) {
            if (e.key === 'esc' && this.element.is(':shown')) {
                this.hide();
            }
        }.bind(this));

        this.element
            .on('click', options.closeEvent, this.__hide.bind(this))
            .on('click', options.submitEvent, this.__submit.bind(this));
    };

    /**
     * Disable component.
     *
     * @returns {Titon.Modal}
     */
    this.disable = function() {
        this.enabled = false;

        return this;
    };

    /**
     * Enable component.
     *
     * @returns {Titon.Modal}
     */
    this.enable = function() {
        this.enabled = true;

        return this;
    };

    /**
     * Hide the modal and reset relevant values.
     *
     * @returns {Titon.Modal}
     */
    this.hide = function() {
        this.element.conceal();

        if (this.options.blackout) {
            this.blackout.hide();
        }

        return this;
    };

    /**
     * Position the modal in the center of the screen.
     *
     * @param {String|jQuery} content
     * @returns {Titon.Modal}
     */
    this.position = function(content) {
        // AJAX is currently loading
        if (content === true) {
            return this;
        }

        this.elementBody.html(content);

        if (!this.element.is(':shown')) {
            if (this.options.blackout) {
                this.blackout.show();
            }

            this.element.reveal();
        }

        return this;
    };

    /**
     * Show the modal with the specific content.
     * If a node is passed, grab the modal AJAX URL or target element.
     * If content is passed, display it immediately.
     *
     * @param {jQuery} node
     * @param {String} [content]
     * @returns {Titon.Modal}
     */
    this.show = function(node, content) {
        node = $(node);

        var options = this.options;

        // Get content
        if (content) {
            options.ajax = false;

        } else if (node) {
            content = Titon.readValue.apply(this, [node, options.getContent]) || node.get('href');

            if (content.substr(0, 1) === '#') {
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
                $.ajax({
                    url: content,
                    type: 'get',

                    success: function(response) {
                        this.cache[content] = response;

                        if (this.options.showLoading) {
                            this.element.removeClass('is-loading');
                        }

                        this.position(response);
                    }.bind(this),

                    beforeSend: function() {
                        this.cache[content] = true;

                        if (this.options.showLoading) {
                            this.element.addClass('is-loading');

                            this.position(Titon.loadingTemplate('modal'));
                        }
                    }.bind(this),

                    error: function() {
                        delete this.cache[content];

                        this.element
                            .removeClass('is-loading')
                            .addClass('has-failed');

                        this.position(Titon.errorTemplate('modal'));
                    }.bind(this)
                });
            }
        } else {
            this.position(content);
        }

        return this;
    };

    /**
     * Event handler for hide().
     *
     * @private
     * @param {Event} e
     */
    this.__hide = function(e) {
        e.preventDefault();

        this.hide();
    };

    /**
     * Event handler for show().
     *
     * @private
     * @param {Event} e
     */
    this.__show = function(e) {
        e.preventDefault();
        e.stopPropagation();

        if (!this.enabled) {
            return;
        }

        this.show(e.target);
    };

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {Event} e
     */
    this.__submit = function(e) {
        e.preventDefault();
        e.stopPropagation();

        var button = $(e.target),
            form = button.parents('form');

        if (!form) {
            return;
        }

        $.ajax({
            url: form.attr('action'),
            type: (form.attr('method') || 'post').toUpperCase(),
            data: form.serialize(),
            success: function(response) {
                this.position(response);
            }.bind(this),
            error: function() {
                this.position(Titon.errorTemplate('modal'));
            }.bind(this)
        });
    };

    // Initialize the class only if elements exists
    this.initialize();
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
 * @returns {Titon.Modal}
 */
$.fn.modal = function(options) {
    if (this.$modal) {
        return this.$modal;
    }

    this.$modal = new Titon.Modal(this, options);

    return this.$modal;
};

$.fn.modal.options = {
    animation: 'fade',
    className: '',
    context: null,
    ajax: true,
    draggable: false,
    blackout: true,
    showLoading: true,
    getContent: 'data-modal',
    contentElement: '.modal-inner',
    closeElement: '.modal-close',
    closeEvent: '.modal-event-close',
    submitEvent: '.modal-event-submit',
    template: '<div class="modal">' +
        '<div class="modal-outer">' +
            '<div class="modal-inner"></div>' +
            '<button type="button" class="close modal-event-close">' +
                '<span class="x">&times;</span>' +
            '</button>' +
        '</div>' +
    '</div>'
};

})(jQuery);