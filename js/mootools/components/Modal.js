/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Modal = new Class({
    Extends: Toolkit.Component,
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
        fullScreen: false,
        stopScroll: true,
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
        '</div>',

        // Events
        onSubmit: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.setNodes(elements);
        this.createElement();

        if (this.options.fullScreen) {
            this.element.addClass(Toolkit.options.isPrefix + 'fullscreen');
            this.options.draggable = false;
        }

        // Get elements
        this.elementBody = this.element.getElement(this.options.contentElement);

        // Draggable
        if (this.options.draggable) {
            this.drag = new Drag(this.element, {
                onStart: function(element) {
                    element.addClass(Toolkit.options.isPrefix + 'dragging');
                },
                onComplete: function(element) {
                    element.removeClass(Toolkit.options.isPrefix + 'dragging');
                }
            });

            this.element.addClass(Toolkit.options.isPrefix + 'draggable');
        }

        // Blackout
        if (this.options.blackout) {
            this.blackout = Toolkit.Blackout.factory();

            if (this.options.stopScroll) {
                this.blackout.addEvent('hide', function(hidden) {
                    if (hidden) {
                        document.body.setStyle('overflow', '');
                    }
                });
            }
        }

        // Set events
        this.bindEvents();
        this.fireEvent('init');
    },

    /**
     * Set delegation and window events.
     *
     * @returns {Toolkit.Modal}
     */
    bindEvents: function() {
        this.parent();

        window.addEvent('keydown', function(e) {
            if (e.key === 'esc' && this.isVisible()) {
                this.hide();
            }
        }.bind(this));

        this.element
            .addEvent('clickout', this.__hide)
            .addEvent('click:relay(' + this.options.closeEvent + ')', this.__hide)
            .addEvent('click:relay(' + this.options.submitEvent + ')', this.__submit);

        this.nodes
            .addEvent('clickout', this.__hide);

        return this;
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

        this.elementBody.set('html', content);
        this.fireEvent('load', content);

        // Hide blackout loading message
        if (this.blackout) {
            this.blackout.hideLoader();
        }

        // Reveal modal
        this.element.reveal();

        // Resize modal
        if (this.options.fullScreen) {
            this.element.getElement(this.options.contentElement)
                .setStyle('min-height', window.getHeight());

        // IE8
        } else if (!Toolkit.hasTransform) {
            var size = this.element.getSize();

            this.element.setStyles({
                'margin-left': -(size.x / 2),
                'margin-top': -(size.y / 2)
            });
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
            content = this.readValue(node, options.getContent) || node.get('href');

            if (content && content.match(/^#[a-z0-9_\-\.:]+$/i)) {
                ajax = false;
            }
        }

        if (!content) {
            return this;
        }

        this.node = node;

        // Show blackout
        if (this.blackout) {
            this.blackout.show();
        }

        if (options.stopScroll) {
            document.body.setStyle('overflow', 'hidden');
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
     * Submit the form within the modal if it exists and re-render the modal with the response.
     *
     * @private
     * @param {DOMEvent} e
     */
    __submit: function(e) {
        e.preventDefault();

        var button = e.target,
            form = this.elementBody.getElement('form');

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

    /**
     * Defines a component that can be instantiated through modal().
     */
    Toolkit.createComponent('modal', function(options) {
        return new Toolkit.Modal(this, options);
    }, true);

})();