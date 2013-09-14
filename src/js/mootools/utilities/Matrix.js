/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

// TODO - column spanning
Titon.Matrix = new Class({
    Extends: Titon.Component,
    Binds: ['_resize'],

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

    /**
     * Default options.
     *
     *    selector    - (string) The class name for items to position within the grid
     *    width       - (int) The average width that each item should conform to
     *    gutter      - (int) The spacing between each item in the grid
     *    rtl         - (bool) Whether to render the items right to left
     *    onRender    - (function) Callback to trigger when the grid is rendered
     */
    options: {
        selector: '.matrix-item',
        width: 200,
        gutter: 20,
        rtl: false,
        template: false,

        // Events
        onRender: null
    },

    /**
     * Initialize items and events for a matrix grid.
     *
     * @param {Element} element
     * @param {Object} options
     */
    initialize: function(element, options) {
        this.setOptions(options);
        this.setElement(element);

        // Load elements
        this.items = this.element.getElements(this.options.selector);

        // Set events
        this.disable().enable();

        window.addEvent('resize', this._resize.debouce());

        this.fireEvent('init');

        // Render immediately
        this.render();
    },

    /**
     * Add required classes to elements.
     *
     * @returns {Titon.Matrix}
     */
    enable: function() {
        this.element.addClass('matrix');
        this.items.addClass('matrix-item');

        return this;
    },

    /**
     * Remove required classes and set items back to defaults.
     *
     * @returns {Titon.Matrix}
     */
    disable: function() {
        this.element.removeClass('matrix').removeProperty('style');
        this.items.removeClass('matrix-item').removeProperty('style');

        return this;
    },

    /**
     * Append an item to the bottom of the matrix.
     *
     * @param {Element} item
     * @returns {Titon.Matrix}
     */
    append: function(item) {
        if (typeOf(item) !== 'element') {
            return this;
        }

        item
            .addClass('matrix-item')
            .inject(this.element, 'bottom')
            .setStyle('opacity', 0);

        return this.refresh();
    },

    /**
     * Prepend an item to the top of the matrix.
     *
     * @param {Element} item
     * @returns {Titon.Matrix}
     */
    prepend: function(item) {
        if (typeOf(item) !== 'element') {
            return this;
        }

        item
            .addClass('matrix-item')
            .inject(this.element, 'top')
            .setStyle('opacity', 0);

        return this.refresh();
    },

    /**
     * Fetch new items and re-render the grid.
     *
     * @returns {Titon.Matrix}
     */
    refresh: function() {
        this.items = this.element.getElements(this.options.selector);

        return this.render();
    },

    /**
     * Remove an item from the grid (and DOM) and re-render.
     *
     * @param {Element} item
     * @returns {Titon.Matrix}
     */
    remove: function(item) {
        this.items.each(function(el) {
            if (el === item) {
                el.remove();
            }
        });

        return this.refresh();
    },

    /**
     * Calculate and position items in the grid.
     *
     * @returns {Titon.Matrix}
     */
    render: function() {
        this._calculateColumns();

        if (this.colCount <= 1) {
            this.items.removeProperty('style');
            this.element.addClass('no-columns');

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
     * @returns {Titon.Matrix}
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
                colWidth -= Math.round(diff / cols);

            } else if (colsWidth < wrapperWidth) {
                diff = wrapperWidth - colsWidth;
                colWidth += Math.round(diff / cols);
            }
        }

        this.wrapperWidth = wrapperWidth;
        this.colWidth = colWidth;
        this.colCount = cols;

        return this;
    }.protect(),

    /**
     * Organize the items into columns by looping over each item and calculating dimensions.
     * If an item spans multiple columns, account for it by filling with an empty space.
     *
     * @private
     * @returns {Titon.Matrix}
     */
    _organizeItems: function() {
        var item,
            span,
            size,
            c = 0, // current column
            l = this.items.length;

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
     * @returns {Titon.Matrix}
     */
    _positionItems: function() {
        var gutter = this.options.gutter,
            items = this.matrix,
            item,
            dir = this.options.rtl ? 'right' : 'left',
            x = 0, y = [], top,
            c = 0, i, il, s,
            pos = { margin: 0 };

        for (i = 0; i < this.colCount; i++) {
            y.push(0);
        }

        for (i = 0, il = items.length; i < il; i++) {
            item = items[i];

            // If the item extends too far out, move it to the next column
            // Or if the last column has been reached
            if ((c >= this.colCount) || ((item.span + c) > this.colCount)) {
                c = 0;
                x = 0;
            }

            // Item spans a column or multiple columns
            if (item.span) {
                top = 0;

                // If the item spans multiple columns
                // Get the largest height from the previous row
                for (s = 0; s < item.span; s++) {
                    if (y[c + s] > top) {
                        top = y[c + s];
                    }
                }

                pos.top = top;
                pos[dir] = x;
                pos.width = ((this.colWidth + gutter) * item.span) - gutter;

                item.item.setStyles(pos).reveal();
            }

            // Fetch the height after the position/width has been set
            y[c] = (item.item.getCoordinates(this.element).bottom + gutter);

            x += (this.colWidth + gutter);
            c++;
        }

        // Set height of wrapper
        this.element.setStyle('height', Math.max.apply(Math, y));

        return this;
    }.protect(),

    /**
     * Event handler for browser resizing.
     *
     * @private
     */
    _resize: function() {
        if (this.element.hasClass('matrix')) {
            this.render();
        }
    }

});

/**
 * Enable a matrix grid on an element by calling matrix().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('matrix-id').matrix({
 *         width: 200
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Matrix}
 */
Element.implement('matrix', function(options) {
    if (this.$matrix) {
        return this.$matrix;
    }

    this.$matrix = new Titon.Matrix(this, options);

    return this.$matrix;
});

})();