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

    /** Body DOM element */
    this.elementBody = null;

    /** Blackout instance if options.blackout is true */
    this.blackout = null;

    /** Drag instance if options.draggable is true */
    this.drag = null;

    /** Cache requests */
    this.cache = {};

    /**
     * Initialize elements and attach events.
     */
    this.initialize = function() {
        this.elementBody = this.element.find(this.options.contentElement);

        // Blackout
        if (this.options.blackout) {
            this.blackout = new Titon.Blackout();
            this.blackout.element.on('click', this._hide.bind(this));
        }

        // Set events
        this.disable().enable();

        $(window).on('keydown', function(e) {
            if (e.key === 'esc' && this.element.is(':shown')) {
                this.hide();
            }
        }.bind(this));

        this.element
            .on('click', this.options.closeEvent, this._hide.bind(this))
            .on('click', this.options.submitEvent, this._submit.bind(this));
    };

    /**
     * Enable events.
     *
     * @returns {Titon.Flyout}
     */
    this.enable = function() {
        $(this.options.context || document)
            .on('click', this.nodes.selector, this._show.bind(this));

        return this;
    };

    /**
     * Disable events.
     *
     * @returns {Titon.Flyout}
     */
    this.disable = function() {
        $(this.options.context || document)
            .off('click', this.nodes.selector, this._show.bind(this));

        return this;
    };

    /**
     * Hide the modal and reset relevant values.
     *
     * @returns {Titon.Modal}
     */
    this.hide = function() {
        if (this.element.is(':shown')) {
            this.element.conceal();

            if (this.options.blackout) {
                this.blackout.hide();
            }
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
            content = Titon.getValue.apply(this, [node, options.getContent]) || node.get('href');

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
                this._position(this.cache[content]);
            } else {
                $.ajax({
                    url: content,
                    type: 'get',

                    success: function(response) {
                        this.cache[content] = response;

                        if (this.options.showLoading) {
                            this.element.removeClass('is-loading');
                        }

                        this._position(response);
                    }.bind(this),

                    beforeSend: function() {
                        this.cache[content] = true;

                        if (this.options.showLoading) {
                            this.element.addClass('is-loading');

                            this._position(Titon.loadingTemplate('modal'));
                        }
                    }.bind(this),

                    error: function() {
                        delete this.cache[content];

                        this.element
                            .removeClass('is-loading')
                            .addClass('has-failed');

                        this._position(Titon.errorTemplate('modal'));
                    }.bind(this)
                });
            }
        } else {
            this._position(content);
        }

        return this;
    };

    /**
     * Event handler for hide().
     *
     * @private
     * @param {Event} e
     */
    this._hide = function(e) {
        e.preventDefault();

        this.hide();
    };

    /**
     * Position the modal in the center of the screen.
     *
     * @private
     * @param {String|jQuery} content
     */
    this._position = function(content) {
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
     * Event handler for show().
     *
     * @private
     * @param {Event} e
     */
    this._show = function(e) {
        e.preventDefault();
        e.stopPropagation();

        this.show(e.target);
    };

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {Event} e
     */
    this._submit = function(e) {
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
                this._position(response);
            }.bind(this),
            error: function() {
                this._position(Titon.errorTemplate('modal'));
            }.bind(this)
        });
    };

    // Initialize the class only if elements exists
    if (this.nodes.length) {
        this.initialize();
    }
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