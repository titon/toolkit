/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Matrix = Toolkit.Component.extend(function(element, options) {
    this.component = 'Matrix';
    this.version = '1.2.0';
    this.element = element = $(element).addClass(vendor + 'matrix');
    this.options = options = this.setOptions(options, element);

    // Items within the matrix
    this.items = element.find('> li');

    // List of items in order and how many columns they span horizontally
    this.matrix = [];

    // Width of the wrapper (target element)
    // Is recalculated every page resize to determine columns
    this.wrapperWidth = 0;

    // Calculated final width of the column (may differ from width option)
    this.colWidth = 0;

    // How many columns that can fit in the wrapper
    this.colCount = 0;

    // Collection of img elements
    this.images = [];

    // How many images have loaded or tried to load
    this.imagesLoaded = 0;

    // Initialize events
    this.events = {
        'resize window': $.debounce(this.onResize)
    };

    this.initialize();

    // Render the matrix
    if (options.defer) {
        this._deferRender();
    } else {
        this.render();
    }
}, {

    /**
     * Append an item to the bottom of the matrix.
     *
     * @param {jQuery} item
     */
    append: function(item) {
        $(item)
            .appendTo(this.element)
            .css('opacity', 0);

        this.refresh();
    },

    /**
     * Remove inline styles before destroying.
     */
    doDestroy: function() {
        this.element.removeAttr('style');
        this.items.removeAttr('style');
    },

    /**
     * Prepend an item to the top of the matrix.
     *
     * @param {jQuery} item
     */
    prepend: function(item) {
        $(item)
            .prependTo(this.element)
            .css('opacity', 0);

        this.refresh();
    },

    /**
     * Fetch new items and re-render the grid.
     */
    refresh: function() {
        this.items = this.element.find('> li');
        this.render();
    },

    /**
     * Remove an item from the grid (and DOM) and re-render.
     *
     * @param {jQuery} item
     */
    remove: function(item) {
        this.items.each(function() {
            var self = $(this);

            if (self.is(item)) {
                self.remove();
                return false;
            }

            return true;
        });

        this.refresh();
    },

    /**
     * Calculate and position items in the grid.
     */
    render: function() {
        this._calculateColumns();

        // Single row, do not render
        if (this.items.length < this.colCount) {
            this.element.removeAttr('style');

        // Single column
        } else if (this.colCount <= 1) {
            this.element.addClass('no-columns');
            this.items.removeAttr('style');

        // Multi column
        } else {
            this.element.removeClass('no-columns');

            this._organizeItems();
            this._positionItems();
        }

        this.fireEvent('render');
    },

    /**
     * Calculate how many columns can be supported in the current resolution.
     * Modify the column width to account for gaps on either side.
     *
     * @private
     */
    _calculateColumns: function() {
        var wrapperWidth = this.element.outerWidth(),
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
    },

    /**
     * Fetch all images within the matrix and attach an onload event.
     * This will monitor loaded images and render once all are complete.
     * Uses a src swap trick to force load cached images.
     *
     * @private
     */
    _deferRender: function() {
        this.imagesLoaded = 0;
        this.images = this.element.find('img');

        if (this.images.length) {
            this.images.each(function(index, image) {
                var src = image.src;

                image.onload = this.onLoad;
                image.onerror = this.onLoad;
                image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
                image.src = src;
            }.bind(this));
        } else {
            this.render();
        }
    },

    /**
     * Organize the items into columns by looping over each item and calculating dimensions.
     * If an item spans multiple columns, account for it by filling with an empty space.
     *
     * @private
     */
    _organizeItems: function() {
        var item,
            span,
            size,
            c = 0,
            l = this.items.length;

        this.matrix = [];

        for (var i = 0; i < l; i++) {
            item = this.items.item(i);
            size = item.outerWidth();

            // How many columns does this item span?
            span = Math.max(Math.round(size / this.colWidth), 1);

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
    },

    /**
     * Loop through the items in each column and position them absolutely.
     *
     * @private
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

                item.item.css(pos).reveal();

                // Loop again to add the value to each columns Y top value
                // This must be done after positioning so we can calculate a new size
                for (s = 0; s < span; s++) {
                    y[c + s] = item.item.outerHeight() + gutter + top;
                }
            }

            x += (this.colWidth + gutter);
            c++;
        }

        // Set height of wrapper
        this.element.css('height', Math.max.apply(Math, y));
    },

    /**
     * Event handler for image loading.
     * Will defer rendering until all inline images are loaded.
     *
     * @private
     * @param {jQuery.Event} e
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
     */
    onResize: function() {
        this.refresh();
    }

}, {
    width: 200,
    gutter: 20,
    rtl: false,
    defer: true
});

Toolkit.create('matrix', function(options) {
    return new Toolkit.Matrix(this, options);
});