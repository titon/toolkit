/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Modal = new Class({
    Extends: Titon.Component,
    Binds: ['__submit'],

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
        '</div>',

        // Events
        onSubmit: null
    },

    /**
     * Initialize the modal be creating the DOM elements and setting default events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.setNodes(elements);
        this.createElement();

        // Get elements
        this.elementBody = this.element.getElement(this.options.contentElement);

        // Draggable
        if (this.options.draggable) {
            this.drag = new Drag(this.element, {
                onStart: function(element) {
                    element.addClass('is-dragging');
                },
                onComplete: function(element) {
                    element.removeClass('is-dragging');
                }
            });

            this.element.addClass('is-draggable');
        }

        // Blackout
        if (this.options.blackout) {
            this.blackout = new Titon.Blackout();
            this.blackout.element.addEvent('click', this.__hide);
        }

        // Set events
        this.bindEvents();
    },

    /**
     * Set delegation and window events.
     *
     * @returns {Titon.Modal}
     */
    bindEvents: function() {
        this.parent();

        window.addEvent('keydown', function(e) {
            if (e.key === 'esc' && this.isVisible()) {
                this.hide();
            }
        }.bind(this));

        this.element
            .addEvent('click:relay(' + this.options.closeEvent + ')', this.__hide)
            .addEvent('click:relay(' + this.options.submitEvent + ')', this.__submit);

        return this;
    },

    /**
     * Hide the modal.
     *
     * @returns {Titon.Modal}
     */
    hide: function() {
        return this.parent(function() {
            if (this.options.blackout) {
                this.blackout.hide();
            }
        }.bind(this));
    },

    /**
     * Show the modal with the specific content.
     * If a node is passed, grab the modal AJAX URL or target element.
     * If content is passed, display it immediately.
     *
     * @param {Element} node
     * @param {String|Element} [content]
     * @returns {Titon.Modal}
     */
    show: function(node, content) {
        var options = this.options;

        // Get content
        if (content) {
            options.ajax = false;

        } else if (node) {
            content = this.readValue(node, options.getContent) || node.get('href');

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
                this.requestData(content);
            }
        } else {
            this._position(content);
        }

        return this;
    },

    /**
     * Position the modal in the center of the screen.
     *
     * @private
     * @param {String|Element} content
     */
    _position: function(content) {
        // AJAX is currently loading
        if (content === true) {
            return;
        }

        this.elementBody.set('html', content);

        if (!this.isVisible()) {
            if (this.options.blackout) {
                this.blackout.show();
            }

            this.element.reveal();
        }

        this.fireEvent('show');
    },

    /**
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {DOMEvent} e
     */
    __submit: function(e) {
        e.stop();

        var button = e.target,
            form = button.getParent('form');

        if (!form) {
            return;
        }

        this.fireEvent('submit', button);

        new Request({
            url: form.get('action'),
            method: form.get('method').toUpperCase(),
            data: form.toQueryString(),
            evalScripts: true,
            onSuccess: function(response) {
                this._position(response);
            }.bind(this),
            onFailure: function() {
                this._position(this._errorTemplate());
            }.bind(this)
        }).send();
    }

});

/**
 * Enable modals on Elements collections by calling modal().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $$('.js-modal').modal({
 *         draggable: true
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Modal}
 */
Elements.implement('modal', function(options) {
    if (this.$modal) {
        return this.$modal;
    }

    this.$modal = new Titon.Modal(this, options);

    return this.$modal;
});

})();