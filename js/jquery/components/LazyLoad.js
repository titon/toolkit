/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.LazyLoad = Toolkit.Component.create(function(elements, options) {
        this.component = 'LazyLoad';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.LazyLoad.options, options);

        /** List of elements to load */
        this.elements = this.setElement(elements, this.options);

        /** Have all elements been force loaded? */
        this.isLoaded = false;

        /** Count of how many have loaded */
        this.loaded = 0;

        this.initialize();
    });

    Toolkit.LazyLoad.options = {
        forceLoad: false,
        delay: 10000,
        threshold: 150,
        throttle: 50,
        context: null
    };

    var LazyLoad = Toolkit.LazyLoad.prototype;

    /**
     * Initialize the component by fetching elements and binding events.
     * Call load() immediately on page load.
     */
    LazyLoad.initialize = function() {
        $(this.options.context || window).on({
            scroll: $.throttle(this.load.bind(this), this.options.throttle),
            resize: $.throttle(this.load.bind(this), this.options.throttle)
        });

        // Load elements within viewport
        $(function() {
            this.load();

            // Set force load on DOM ready
            if (this.options.forceLoad) {
                window.setTimeout(this.loadAll.bind(this), this.options.delay);
            }
        }.bind(this));

        this.fireEvent('init');
    };

    /**
     * Verify that the element is within the current browser viewport.
     *
     * @param {jQuery} node
     * @returns {bool}
     */
    LazyLoad.inViewport = function(node) {
        var win = $(window),
            threshold = this.options.threshold,
            scrollTop = win.scrollTop(),
            scrollLeft = win.scrollLeft(),
            nodeOffset = $(node).offset();

        return (
            // Below the top
            (nodeOffset.top >= (scrollTop - threshold)) &&
            // Above the bottom
            (nodeOffset.top <= (scrollTop + win.height() + threshold)) &&
            // Right of the left
            (nodeOffset.left >= (scrollLeft - threshold)) &&
            // Left of the right
            (nodeOffset.left <= (scrollLeft + win.width() + threshold))
        );
    };

    /**
     * Loop over the lazy loaded elements and verify they are within the viewport.
     *
     * @returns {bool}
     */
    LazyLoad.load = function() {
        if (this.isLoaded) {
            return false;
        }

        if (this.loaded === this.elements.length) {
            this.shutdown();

            return false;
        }

        this.elements.each(function(index, node) {
            if (node && this.inViewport(node)) {
                this.show(node, index);
            }
        }.bind(this));

        this.fireEvent('load');

        return true;
    };

    /**
     * Load the remaining hidden elements and remove any container events.
     *
     * @returns {bool}
     */
    LazyLoad.loadAll = function() {
        if (this.isLoaded) {
            return false;
        }

        this.elements.each(function(index, node) {
            this.show(node, index);
        }.bind(this));

        this.fireEvent('loadAll');

        this.shutdown();

        return true;
    };

    /**
     * Show the element by removing the lazy load class.
     *
     * @param {jQuery} node
     * @param {Number} index
     * @returns {Toolkit.LazyLoad}
     */
    LazyLoad.show = function(node, index) {
        node = $(node);
        node.removeClass(this.elements.selector.substr(1));

        // Replace src attributes on images
        node.find('img').each(function() {
            var image = $(this),
                data = image.data('lazyload');

            if (data) {
                image.attr('src', data);
            }
        });

        // Replace element with null since removing from the array causes it to break
        this.elements.splice(index, 1, null);
        this.loaded++;

        this.fireEvent('show', node);

        return this;
    };

    /**
     * When triggered, will shutdown the instance from executing any longer.
     * Any container events will be removed and loading will cease.
     *
     * @returns {Toolkit.LazyLoad}
     */
    LazyLoad.shutdown = function() {
        this.isLoaded = true;

        $(this.options.context || window).off({
            scroll: this.load.bind(this),
            resize: this.load.bind(this)
        });

        this.fireEvent('shutdown');

        return this;
    };

    /**
     * Enable lazy loading on Elements collections by calling lazyLoad().
     * An object of options can be passed as the 1st argument.
     * The class instance will be cached and returned from this function.
     *
     * @example
     *     $('.lazy-load').lazyLoad({
     *         forceLoad: false
     *     });
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    $.fn.lazyLoad = function(options) {
        var lazyLoad = new Toolkit.LazyLoad(this, options);

        return this.each(function() {
            $(this).addData('toolkit.lazyload', lazyLoad);
        });
    };

})(jQuery);