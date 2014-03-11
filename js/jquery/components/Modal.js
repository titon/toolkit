/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Modal = Toolkit.Component.extend(function(nodes, options) {
        var element, events;

        this.component = 'Modal';
        this.version = '1.1.0';
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement();
        this.elementBody = element.find(options.contentElement);
        this.nodes = nodes = $(nodes);
        this.node = null;
        this.blackout = null;
        this.drag = null;
        this.cache = {};
        this.events = events = {};

        // Fullscreen
        if (options.fullScreen) {
            element.addClass(Toolkit.options.isPrefix + 'fullscreen');
            options.draggable = false;
        }

        // Blackout
        if (options.blackout) {
            this.blackout = Toolkit.Blackout.factory();

            if (options.stopScroll) {
                this.blackout.element.on('hide.toolkit.blackout', function(e, hidden) {
                    if (hidden) {
                        $('body').removeClass('no-scroll');
                    }
                });
            }
        }

        // Initialize events
        events['clickout element'] = 'onHide';
        events['clickout nodes'] = 'onHide';
        events['keydown window'] = 'onKeydown';
        events['click ' + nodes.selector] = 'onShow';
        events['click element ' + options.closeEvent] = 'onHide';
        events['click element ' + options.submitEvent] = 'onSubmit';

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

            this.elementBody.html(content);
            this.fireEvent('load', content);

            // Reveal modal
            this.element.reveal();

            // Resize modal
            if (this.options.fullScreen) {
                this.element.find(this.options.contentElement)
                    .css('min-height', $(window).height());
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
                node = $(node);

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

            this.node = node;

            // Show blackout
            if (this.blackout) {
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
        contentElement: '.modal-inner',
        closeElement: '.modal-close',
        closeEvent: '.modal-event-close',
        submitEvent: '.modal-event-submit',
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
    Toolkit.createComponent('modal', function(options) {
        return new Toolkit.Modal(this, options);
    }, true);

})(jQuery);