/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.LazyLoad = Titon.Component.create(function(elements, options) {

    /** Custom options */
    this.options = this.setOptions($.fn.lazyLoad.options, options);

    /** List of elements to load */
    this.elements = this.setElement(elements, this.options);

    /** Have all elements been force loaded? */
    this.isLoaded = false;

    /** Count of how many have loaded */
    this.loaded = 0;

    /**
     * Initialize the component by fetching elements and binding events.
     * Call load() immediately on page load.
     */
    this.initialize = function() {
        $(this.options.context || window).on({
            scroll: $.debounce(this.load.bind(this), 50),
            resize: $.debounce(this.load.bind(this), 50)
        });

        // Load elements within viewport
        $(function() {
            this.load();

            // Set force load on DOM ready
            if (this.options.forceLoad) {
                window.setTimeout(this.loadAll.bind(this), this.options.delay);
            }
        }.bind(this));
    };

    /**
     * Verify that the element is within the current browser viewport.
     *
     * @param {jQuery} node
     * @returns {bool}
     */
    this.inViewport = function(node) {
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
    this.load = function() {
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

        return true;
    };

    /**
     * Load the remaining hidden elements and remove any container events.
     *
     * @returns {bool}
     */
    this.loadAll = function() {
        if (this.isLoaded) {
            return false;
        }

        this.elements.each(function(index, node) {
            this.show(node, index);
        }.bind(this));

        this.shutdown();

        return true;
    };

    /**
     * Show the element by removing the lazy load class.
     *
     * @param {jQuery} node
     * @param {Number} index
     * @returns {Titon.LazyLoad}
     */
    this.show = function(node, index) {
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

        return this;
    };

    /**
     * When triggered, will shutdown the instance from executing any longer.
     * Any container events will be removed and loading will cease.
     *
     * @returns {Titon.LazyLoad}
     */
    this.shutdown = function() {
        this.isLoaded = true;

        $(this.options.context || window).off({
            scroll: this.load.bind(this),
            resize: this.load.bind(this)
        });

        return this;
    };

    // Initialize the class only if elements exists
    if (this.elements.length) {
        this.initialize();
    }
});

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
    var lazyLoad = new Titon.LazyLoad(this, options);

    return this.each(function() {
        if (!this.$lazyLoad) {
            this.$lazyLoad = lazyLoad;
        }
    });
};

$.fn.lazyLoad.options = {
    forceLoad: false,
    delay: 10000,
    threshold: 150,
    context: null
};

})(jQuery);