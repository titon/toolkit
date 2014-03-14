/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.LazyLoad = Toolkit.Component.extend(function(container, options) {
        container = $(container);

        this.component = 'LazyLoad';
        this.version = '1.0.0';
        this.options = options = this.setOptions(options, container);
        this.container = (container.css('overflow') === 'auto') ? container : $(window);
        this.elements = container.find('.lazy-load');
        this.element = null; // Element being loaded
        this.isLoaded = false;
        this.loaded = 0;

        // Initialize events
        var callback = $.throttle(this.load.bind(this), options.throttle);

        this.events = {
            'scroll container': callback,
            'resize window': callback,
            'ready document': 'onReady'
        };

        this.enable();
        this.fireEvent('init');
    }, {

        /**
         * Verify that the element is within the current browser viewport.
         *
         * @param {jQuery} node
         * @returns {bool}
         */
        inViewport: function(node) {
            node = $(node);

            var container = this.container,
                threshold = this.options.threshold,
                conHeight = container.height(),
                conWidth = container.width(),
                scrollTop = container.scrollTop(),
                scrollLeft = container.scrollLeft(),
                nodeOffset = (container[0] !== window) ? node.position() : node.offset();

            return (
                // Element is not hidden
                node.is(':visible') &&
                // Below the top
                (nodeOffset.top >= (scrollTop - threshold)) &&
                // Above the bottom
                (nodeOffset.top <= (scrollTop + conHeight + threshold)) &&
                // Right of the left
                (nodeOffset.left >= (scrollLeft - threshold)) &&
                // Left of the right
                (nodeOffset.left <= (scrollLeft + conWidth + threshold))
            );
        },

        /**
         * Loop over the lazy loaded elements and verify they are within the viewport.
         */
        load: function() {
            if (this.isLoaded) {
                return;
            }

            if (this.loaded === this.elements.length) {
                this.shutdown();
                return;
            }

            this.elements.each(function(index, node) {
                if (node && this.inViewport(node)) {
                    this.show(node, index);
                }
            }.bind(this));

            this.fireEvent('load');
        },

        /**
         * Load the remaining hidden elements and remove any container events.
         */
        loadAll: function() {
            if (this.isLoaded) {
                return;
            }

            this.elements.each(function(index, node) {
                this.show(node, index);
            }.bind(this));

            this.fireEvent('loadAll');
            this.shutdown();
        },

        /**
         * Show the element by removing the lazy load class.
         *
         * @param {jQuery} node
         * @param {Number} index
         */
        show: function(node, index) {
            node = $(node);
            node.removeClass('lazy-load');

            // Set the element being loaded for events
            this.element = node;

            // Replace src attributes on images
            node.find('img').each(function() {
                var image = $(this), src;

                if (Toolkit.isRetina) {
                    src = image.data('src-retina');
                }

                if (!src) {
                    src = image.data('src');
                }

                if (src) {
                    image.attr('src', src);
                }
            });

            // Replace element with null since removing from the array causes it to break
            this.elements.splice(index, 1, null);
            this.loaded++;

            this.fireEvent('show', node);
        },

        /**
         * When triggered, will shutdown the instance from executing any longer.
         * Any container events will be removed and loading will cease.
         */
        shutdown: function() {
            this.isLoaded = true;
            this.disable();
            this.fireEvent('shutdown');
        },

        /**
         * Event handler triggered on DOM ready.
         *
         * @private
         */
        onReady: function() {
            this.load();

            // Set force load on DOM ready
            if (this.options.forceLoad) {
                setTimeout(this.loadAll.bind(this), this.options.delay);
            }
        }

    }, {
        forceLoad: false,
        delay: 10000,
        threshold: 150,
        throttle: 50
    });

    /**
     * Defines a component that can be instantiated through lazyLoad().
     */
    Toolkit.createComponent('lazyLoad', function(options) {
        return new Toolkit.LazyLoad(this, options);
    });

})(jQuery);