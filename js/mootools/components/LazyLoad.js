/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.LazyLoad = new Class({
    Extends: Toolkit.Component,
    Binds: ['load', 'loadAll'],

    /** Have all elements been force loaded? */
    isLoaded: false,

    /** Count of how many have loaded */
    loaded: 0,

    /** Default options */
    options: {
        lazyClass: '.lazy-load',
        forceLoad: false,
        delay: 10000,
        threshold: 150,
        throttle: 50,
        context: null,

        // Events
        onLoad: null,
        onLoadAll: null,
        onShow: null,
        onShutdown: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     * Call load() immediately on page load.
     *
     * @param {Elements} elements
     * @param {Object} [options]
     */
    initialize: function(elements, options) {
        this.parent(options);
        this.setElement(elements);

        // Exit if no elements
        if (!this.element.length) {
            return;
        }

        // Add events
        document.id(this.options.context || window)
            .addEvent('scroll:throttle(' + this.options.throttle + ')', this.load)
            .addEvent('resize:throttle(' + this.options.throttle + ')', this.load);

        // Load elements within viewport
        window.addEvent('domready', function() {
            this.load();

            // Set force load on DOM ready
            if (this.options.forceLoad) {
                window.setTimeout(this.loadAll, this.options.delay);
            }
        }.bind(this));

        this.fireEvent('init');
    },

    /**
     * Verify that the element is within the current browser viewport.
     *
     * @param {Element} node
     * @returns {bool}
     */
    inViewport: function(node) {
        var threshold = this.options.threshold,
            scrollSize = window.getScroll(),
            windowSize = window.getSize(),
            nodeOffset = node.getPosition();

        return (
            // Below the top
            (nodeOffset.y >= (scrollSize.y - threshold)) &&
            // Above the bottom
            (nodeOffset.y <= (scrollSize.y + windowSize.y + threshold)) &&
            // Right of the left
            (nodeOffset.x >= (scrollSize.x - threshold)) &&
            // Left of the right
            (nodeOffset.x <= (scrollSize.x + windowSize.x + threshold))
        );
    },

    /**
     * Loop over the lazy loaded elements and verify they are within the viewport.
     *
     * @returns {bool}
     */
    load: function() {
        if (this.isLoaded) {
            return false;
        }

        if (this.loaded === this.element.length) {
            this.shutdown();

            return false;
        }

        this.element.each(function(node, index) {
            if (node && this.inViewport(node)) {
                this.show(node, index);
            }
        }, this);

        this.fireEvent('load');

        return true;
    },

    /**
     * Load the remaining hidden elements and remove any container events.
     *
     * @returns {bool}
     */
    loadAll: function() {
        if (this.isLoaded) {
            return false;
        }

        this.element.each(function(node, index) {
            if (node) {
                this.show(node, index);
            }
        }, this);

        this.fireEvent('loadAll');

        this.shutdown();

        return true;
    },

    /**
     * Show the element by removing the lazy load class.
     *
     * @param {Element} node
     * @param {Number} index
     * @returns {Toolkit.LazyLoad}
     */
    show: function(node, index) {
        node.removeClass(this.options.lazyClass.substr(1));

        // Replace src attributes on images
        node.getElements('img').each(function(image) {
            var data = image.get('data-lazyload');

            if (data) {
                image.set('src', data);
            }
        });

        // Replace element with null since removing from the array causes it to break
        this.element.splice(index, 1, null);
        this.loaded++;

        this.fireEvent('show', node);

        return this;
    },

    /**
     * When triggered, will shutdown the instance from executing any longer.
     * Any container events will be removed and loading will cease.
     *
     * @returns {Toolkit.LazyLoad}
     */
    shutdown: function() {
        this.isLoaded = true;

        document.id(this.options.context || window).removeEvents({
            scroll: this.load,
            resize: this.load
        });

        this.fireEvent('shutdown');

        return this;
    }

});

/**
 * Enable lazy loading on Elements collections by calling lazyLoad().
 * An object of options can be passed as the 1st argument.
 *
 * @example
 *     $$('.lazy-load').lazyLoad({
 *         forceLoad: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Element}
 */
Elements.implement('lazyLoad', function(options) {
    var lazyLoad = new Toolkit.LazyLoad(this, options);

    return this.each(function(el) {
        if (!el.$lazyLoad) {
            el.$lazyLoad = lazyLoad;
        }
    });
});

})();