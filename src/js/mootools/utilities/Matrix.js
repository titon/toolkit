/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

// TODO - column spanning
Titon.Matrix = new Class({
	Extends: Titon.Component,
	Binds: ['_resize'],

	/** List of DOM elements for items to position in the grid */
	items: [],

	/** Current width of the wrapper */
	wrapperWidth: 0,

	/** The final width of each column */
	colWidth: 0,

	/** How many columns to render in the grid */
	colCount: 0,

	/** List of items organized into sub-lists for each column */
	colItems: [],

	/** Height (numbers of items and gutter) of each column */
	colHeights: [],

	/**
	 * Default options.
	 *
	 * 	selector	- (string) The class name for items to position within the grid
	 * 	width		- (int) The average width that each item should conform to
	 * 	gutter		- (int) The spacing between each item in the grid
	 * 	rtl			- (bool) Whether to render the items right to left
	 *	onShutdown	- (function) Callback to trigger when the grid is rendered
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

		// Prepare for height calculation
		this.colItems = [];
		this.colHeights = [];

		while (cols--) {
			this.colItems.push([]);
			this.colHeights.push(0);
		}

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

			// Increase the height for current column
			this.colHeights[c] += (size.y + this.options.gutter);

			this.colItems[c].push({
				height: size.y,
				item: item,
				span: span
			});

			// Multiple columns
			if (span > 1) {
				for (var s = 1; s < span; s++) {
					c++;

					if (this.colItems[c]) {
						this.colHeights[c] += (size.y + this.options.gutter);

						this.colItems[c].push({
							height: size.y,
							item: null // Use empty item so we can skip over during render
						});
					}
				}
			}

			c++;

			if (c >= this.colCount) {
				c = 0;
			}
		}

		// Set height of wrapper
		this.element.setStyle('height', Math.max.apply(Math, this.colHeights));

		return this;
	}.protect(),

	/**
	 * Loop through the items in each column and position them absolutely.
	 *
	 * @private
 	 * @returns {Titon.Matrix}
	 */
	_positionItems: function() {
		var columns = this.colItems,
			items,
			item,
			dir = this.options.rtl ? 'right' : 'left',
			x = 0, y,
			c, cl, i, il,
			pos = { margin: 0 };

		for (c = 0, cl = columns.length; c < cl; c++) {
			items = columns[c];
			y = 0;

			for (i = 0, il = items.length; i < il; i++) {
				item = items[i];

				if (item.item) {
					pos.top = y;
					pos[dir] = x;

					// Allow for column spanning items
					pos.width = (this.colWidth * item.span) + (this.options.gutter * (item.span - 1));

					item.item.setStyles(pos).reveal();

					// Recalculate height since it can change when the width changes
					item.height = item.item.getSize().y;
				}

				y += (item.height + this.options.gutter);
			}

			x += (this.colWidth + this.options.gutter);
		}

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
 * 		$('matrix-id').matrix({
 * 			width: 200
 * 		});
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