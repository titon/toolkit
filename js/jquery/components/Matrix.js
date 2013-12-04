/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.Matrix = Toolkit.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions(Toolkit.Matrix.options, options);

    /** Matrix wrapper */
    this.element = this.setElement(element, this.options);

    /** List of DOM elements for items to position in the grid */
    this.items = [];

    /** List of items organized in order with span detection */
    this.matrix = [];

    /** Current width of the wrapper */
    this.wrapperWidth = 0;

    /** The final width of each column */
    this.colWidth = 0;

    /** How many columns to render in the grid */
    this.colCount = 0;

    /** List of images within the matrix */
    this.images = [];

    /** How many images have been loaded */
    this.imagesLoaded = 0;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        this.element.addClass(Toolkit.options.vendor + 'matrix');
        this.items = this.element.find(this.options.selector);

        // Set events
        $(window).on('resize', $.debounce(this.__resize.bind(this)));

        this.fireEvent('init');

        if (this.options.defer) {
            this._deferRender();
        } else {
            this.render();
        }
    };

    /**
     * Append an item to the bottom of the matrix.
     *
     * @param {jQuery} item
     * @returns {Toolkit.Matrix}
     */
    this.append = function(item) {
        $(item)
            .addClass(Toolkit.options.vendor + 'matrix-item')
            .appendTo(this.element)
            .css('opacity', 0);

        return this.refresh();
    };

    /**
     * Remove required classes and set items back to defaults.
     *
     * @returns {Toolkit.Matrix}
     */
    this.disable = function() {
        this.element.removeProperty('style');
        this.items.removeClass(Toolkit.options.vendor + 'matrix-item').removeProperty('style');

        return this;
    };

    /**
     * Add required classes to elements.
     *
     * @returns {Toolkit.Matrix}
     */
    this.enable = function() {
        this.items.addClass(Toolkit.options.vendor + 'matrix-item');

        return this;
    };

    /**
     * Prepend an item to the top of the matrix.
     *
     * @param {jQuery} item
     * @returns {Toolkit.Matrix}
     */
    this.prepend = function(item) {
        $(item)
            .addClass(Toolkit.options.vendor + 'matrix-item')
            .prependTo(this.element)
            .css('opacity', 0);

        return this.refresh();
    };

    /**
     * Fetch new items and re-render the grid.
     *
     * @returns {Toolkit.Matrix}
     */
    this.refresh = function() {
        this.items = this.element.find(this.options.selector);

        return this.render();
    };

    /**
     * Remove an item from the grid (and DOM) and re-render.
     *
     * @param {jQuery} item
     * @returns {Toolkit.Matrix}
     */
    this.remove = function(item) {
        item = $(item).get(0);

        this.items.each(function() {
            var self = $(this);

            if (self.get(0) === item) {
                self.remove();
                return false;
            }

            return true;
        });

        return this.refresh();
    };

    /**
     * Calculate and position items in the grid.
     *
     * @returns {Toolkit.Matrix}
     */
    this.render = function() {
        this._calculateColumns();

        if (this.items.length < this.colCount) {
            return this.disable();
        } else {
            this.enable();
        }

        if (this.colCount <= 1) {
            this.element.addClass('no-columns');
            this.items.removeAttr('style');

        } else {
            this.element.removeClass('no-columns');

            this._organizeItems();
            this._positionItems();
        }

        this.fireEvent('render');

        return this;
    };

    /**
     * Calculate how many columns can be supported in the current resolution.
     * Modify the column width to account for gaps on either side.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    this._calculateColumns = function() {
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

        return this;
    };

    /**
     * Fetch all images within the matrix and attach an onload event.
     * This will monitor loaded images and render once all are complete.
     * Uses a src swap trick to force load cached images.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    this._deferRender = function() {
        this.imagesLoaded = 0;

        this.images = this.element.find('img');
        this.images.each(function(index, image) {
            var src = image.src;

            image.onload = this.__load.bind(this);
            image.onerror = this.__load.bind(this);
            image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
            image.src = src;
        }.bind(this));

        return this;
    };

    /**
     * Organize the items into columns by looping over each item and calculating dimensions.
     * If an item spans multiple columns, account for it by filling with an empty space.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    this._organizeItems = function() {
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

        return this;
    };

    /**
     * Loop through the items in each column and position them absolutely.
     *
     * @private
     * @returns {Toolkit.Matrix}
     */
    this._positionItems = function() {
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

        return this;
    };

    /**
     * Event handler for image loading.
     * Will defer rendering until all inline images are loaded.
     *
     * @private
     * @param {Event} e
     */
    this.__load = function(e) {
        if (!e || (e.type === 'load' && e.target.complete) || (e.type === 'error' && !e.target.complete)) {
            this.imagesLoaded++; // Continue rendering if load throws an error
        }

        if (this.imagesLoaded === this.images.length) {
            this.render();
        }
    };

    /**
     * Event handler for browser resizing.
     *
     * @private
     * @param {Event} e
     */
    this.__resize = function(e) {
        if (this.element.hasClass(Toolkit.options.vendor + 'matrix')) {
            this.refresh();
        }
    };

    if (this.element.length) {
        this.initialize();
    }
});

Toolkit.Matrix.options = {
    className: '',
    selector: '.matrix-item',
    width: 200,
    gutter: 20,
    rtl: false,
    defer: true,
    template: false
};

/**
 * Enable a matrix grid on an element by calling matrix().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('#matrix-id').matrix({
 *         width: 200
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.matrix = function(options) {
    return this.each(function() {
        $(this).addData('toolkit.matrix', function() {
            return new Toolkit.Matrix(this, options);
        });
    });
};

})(jQuery);