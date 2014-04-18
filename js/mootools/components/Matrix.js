/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Matrix = new Class({
    Extends: Toolkit.Component,
    Binds: ['onResize', 'onLoad'],

    /** List of DOM elements for items to position in the grid */
    items: [],

    /** List of items organized in order with span detection */
    matrix: [],

    /** Current width of the wrapper */
    wrapperWidth: 0,

    /** The final width of each column */
    colWidth: 0,

    /** How many columns to render in the grid */
    colCount: 0,

    /** List of images within the matrix */
    images: [],

    /** How many images have been loaded */
    imagesLoaded: 0,

    /** Default options */
    options: {
        width: 200,
        gutter: 20,
        rtl: false,
        defer: true,
        template: false
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} options
     */
    initialize: function(element, options) {
        this.parent(options);
        this.element = element;
        this.options = this.inheritOptions(this.options, element);

        // Load elements
        element.addClass(Toolkit.vendor + 'matrix');
        this.items = element.getElements('> li');

        // Set events
        this.events = {
            'resize window': this.onResize.debounce()
        };

        this.enable();
        this.fireEvent('init');

        if (this.options.defer) {
            this._deferRender();
        } else {
            this.render();
        }
    },

    /**
     * Append an item to the bottom of the matrix.
     *
     * @param {Element} item
     * @returns {Toolkit.Matrix}
     */
    append: function(item) {
        item
            .inject(this.element, 'bottom')
            .setStyle('opacity', 0);

        return this.refresh();
    },

    /**
     * Prepend an item to the top of the matrix.
     *
     * @param {Element} item
     * @returns {Toolkit.Matrix}
     */
    prepend: function(item) {
        item
            .inject(this.element, 'top')
            .setStyle('opacity', 0);

        return this.refresh();
    },

    /**
     * Fetch new items and re-render the grid.
     *
     * @returns {Toolkit.Matrix}
     */
    refresh: function() {
        this.items = this.element.getElements('> li');

        return this.render();
    },

    /**
     * Remove an item from the grid (and DOM) and re-render.
     *
     * @param {Element} item
     * @returns {Toolkit.Matrix}
     */
    remove: function(item) {
        this.items.every(function(el) {
            if (el === item) {
                el.destroy();
                return false;
            }

            return true;
        });

        return this.refresh();
    },

    /**
     * Calculate and position items in the grid.
     *
     * @returns {Toolkit.Matrix}
     */
    render: function() {
        this._calculateColumns();

        // Single row, do not render
        if (this.items.length < this.colCount) {
            this.element.removeProperty('style');

        // Single column
        } else if (this.colCount <= 1) {
            this.element.addClass('no-columns');
            this.items.removeProperty('style');

        // Multi column
        } else {
            this.element.removeClass('no-columns');

            this._organizeItems();
            this._positionItems();
        }

        this.fireEvent('render');

        return this;
    },

    /**
     * Calculate how many columns can be supported in the current resolution.
     * Modify the column width to account for gaps on either side.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    _calculateColumns: function() {
        var wrapperWidth = this.element.getSize().x,
            colWidth = this.options.width,
            gutter = this.options.gutter,
            cols = Math.max(Math.floor(wrapperWidth / colWidth), 1),
            colsWidth = (cols * (colWidth + gutter)) - gutter,
            diff;

        if (cols > 1) {
            if (colsWidth > wrapperWidth) {
                diff = colsWidth - wrapperWidth;
                colWidth -= (diff / cols);

            } else if (colsWidth < wrapperWidth) {
                diff = wrapperWidth - colsWidth;
                colWidth += (diff / cols);
            }
        }

        this.wrapperWidth = wrapperWidth;
        this.colWidth = colWidth;
        this.colCount = cols;

        return this;
    }.protect(),

    /**
     * Fetch all images within the matrix and attach an onload event.
     * This will monitor loaded images and render once all are complete.
     * Uses a src swap trick to force load cached images.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    _deferRender: function() {
        this.imagesLoaded = 0;

        this.images = this.element.getElements('img');

        if (this.images.length) {
            this.images.each(function(image) {
                var src = image.src;

                image.onload = this.onLoad;
                image.onerror = this.onLoad;
                image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                image.src = src;
            }, this);
        } else {
            this.render();
        }

        return this;
    }.protect(),

    /**
     * Organize the items into columns by looping over each item and calculating dimensions.
     * If an item spans multiple columns, account for it by filling with an empty space.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    _organizeItems: function() {
        var item,
            span,
            size,
            c = 0,
            l = this.items.length;

        this.matrix = [];

        for (var i = 0; i < l; i++) {
            item = this.items[i];
            size = item.getSize();

            // How many columns does this item span?
            span = Math.max(Math.round(size.x / this.colWidth), 1);

            this.matrix.push({
                item: item,
                span: span
            });

            // Multiple columns
            if (span > 1) {
                for (var s = 1; s < span; s++) {
                    c++;

                    if (this.matrix) {
                        this.matrix.push({
                            item: item,
                            span: false // Indicates an empty space
                        });
                    }
                }
            }

            c++;

            if (c >= this.colCount) {
                c = 0;
            }
        }

        return this;
    }.protect(),

    /**
     * Loop through the items in each column and position them absolutely.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    _positionItems: function() {
        var gutter = this.options.gutter,
            items = this.matrix,
            item,
            span,
            dir = this.options.rtl ? 'right' : 'left',
            x = 0, y = [], top,
            c = 0, i, l, s,
            pos = { margin: 0, position: 'absolute' };

        for (i = 0; i < this.colCount; i++) {
            y.push(0);
        }

        for (i = 0, l = items.length; i < l; i++) {
            item = items[i];
            span = item.span;

            // If the item extends too far out, move it to the next column
            // Or if the last column has been reached
            if ((c >= this.colCount) || ((span + c) > this.colCount)) {
                c = 0;
                x = 0;
            }

            // Item spans a column or multiple columns
            if (span) {
                top = 0;

                // If the item spans multiple columns
                // Get the largest height from the previous row
                for (s = 0; s < span; s++) {
                    if (y[c + s] > top) {
                        top = y[c + s];
                    }
                }

                // Position the item
                pos.top = top;
                pos[dir] = x;
                pos.width = ((this.colWidth + gutter) * span) - gutter;

                item.item.setStyles(pos).reveal();

                // Loop again to add the value to each columns Y top value
                // This must be done after positioning so we can calculate a new size
                for (s = 0; s < span; s++) {
                    y[c + s] = item.item.getSize().y + gutter + top;
                }
            }

            x += (this.colWidth + gutter);
            c++;
        }

        // Set height of wrapper
        this.element.setStyle('height', Math.max.apply(Math, y));

        return this;
    }.protect(),

    /**
     * Event handler for image loading.
     * Will defer rendering until all inline images are loaded.
     *
     * @private
     * @param {DOMEvent} e
     */
    onLoad: function(e) {
        if (!e || (e.type === 'load' && e.target.complete) || (e.type === 'error' && !e.target.complete)) {
            this.imagesLoaded++; // Continue rendering if load throws an error
        }

        if (this.imagesLoaded === this.images.length) {
            this.render();
        }
    },

    /**
     * Event handler for browser resizing.
     *
     * @private
     * @param {DOMEvent} e
     */
    onResize: function() {
        this.refresh();
    }

});

/**
 * Defines a component that can be instantiated through matrix().
 */
Toolkit.create('matrix', function(options) {
    return new Toolkit.Matrix(this, options);
});