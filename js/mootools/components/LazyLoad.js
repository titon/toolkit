/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.LazyLoad = new Class({
    Extends: Toolkit.Component,
    Binds: ['load', 'loadAll', 'onReady'],

    /** Container to monitor events on */
    container: null,

    /** List of elements to load */
    elements: [],

    /** Have all elements been force loaded? */
    isLoaded: false,

    /** Count of how many have loaded */
    loaded: 0,

    /** Default options */
    options: {
        forceLoad: false,
        delay: 10000,
        threshold: 150,
        throttle: 50,
        context: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     * Call load() immediately on page load.
     *
     * @param {Element} container
     * @param {Object} [options]
     */
    initialize: function(container, options) {
        this.parent(options);
        this.options = this.inheritOptions(this.options, container);
        this.container = (container.getStyle('overflow') === 'auto') ? container : window;
        this.elements = container.getElements('.lazy-load');

        // Initialize events
        var events,
            throttle = this.options.throttle;

        this.events = events = {
            'ready document': 'onReady'
        };

        events['scroll:throttle(' + throttle + ') container'] = 'load';
        events['resize:throttle(' + throttle + ') window'] = 'load';

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Load all images when destroying.
     */
    doDestroy: function() {
        this.loadAll();
    },

    /**
     * Verify that the element is within the current browser viewport.
     *
     * @param {Element} node
     * @returns {bool}
     */
    inViewport: function(node) {
        var container = this.container,
            threshold = this.options.threshold,
            conSize = container.getSize(),
            scrollSize = container.getScroll(),
            nodeOffset = node.getPosition(container === window ? document.body : container);

        return (
            // Element is not hidden
            node.isVisible() &&
            // Below the top
            (nodeOffset.y >= (scrollSize.y - threshold)) &&
            // Above the bottom
            (nodeOffset.y <= (scrollSize.y + conSize.y + threshold)) &&
            // Right of the left
            (nodeOffset.x >= (scrollSize.x - threshold)) &&
            // Left of the right
            (nodeOffset.x <= (scrollSize.x + conSize.x + threshold))
        );
    },

    /**
     * Loop over the lazy loaded elements and verify they are within the viewport.
     *
     * @returns {bool}
     */
    load: function() {
        if (this.loaded >= this.elements.length) {
            this.shutdown();

            return false;
        }

        this.elements.each(function(node, index) {
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
        this.elements.each(function(node, index) {
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
        node.removeClass('lazy-load');

        // Replace src attributes on images
        node.getElements('img').each(function(image) {
            var src;

            if (Toolkit.isRetina) {
                src = image.get('data-src-retina');
            }

            if (!src) {
                src = image.get('data-src');
            }

            if (src) {
                image.set('src', src);
            }
        });

        // Replace element with null since removing from the array causes it to break
        this.elements.splice(index, 1, null);
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
        if (this.enabled) {
            this.disable();
            this.fireEvent('shutdown');
        }

        return this;
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

});

Toolkit.create('lazyLoad', function(options) {
    return new Toolkit.LazyLoad(this, options);
});