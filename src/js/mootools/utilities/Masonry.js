/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Masonry = new Class({
	Extends: Titon.Component,
	Binds: ['_resize'],

	/** List of DOM elements for items to position in the grid */
	items: [],

	/** List of item heights and indices (used for re-arranging) */
	itemData: [],

	groups: [],

	/** Current width of the wrapper */
	wrapperWidth: 0,

	/** The final width of each column */
	colWidth: 0,

	/** How many columns to render in the grid */
	colCount: 0,

	/** Height (numbers of items and gutter) of each column */
	colHeights: [],

	options: {
		animation: 'fade',
		selector: '.masonry-item',
		width: 200,
		gutter: 20,
		rtl: false
	},

	initialize: function(element, options) {
		this.setOptions(options);
		this.setElement(element);

		if (this.options.animation) {
			this.element.addClass(this.options.animation);
		}

		this.items = this.element.getElements(this.options.selector);

		this.fireEvent('init');

		window.addEvent('resize', this._resize);

		this.disable().enable();

		this.render();
	},

	enable: function() {
		this.element.addClass('masonry-wrapper');
		this.items.addClass('masonry-item');

		return this;
	},

	disable: function() {
		this.element.removeClass('masonry-wrapper').removeProperty('style');
		this.items.removeClass('masonry-item').removeProperty('style');

		return this;
	},

	render: function() {
		this._calculateColumns();

		// Exit early if only 1 column
		if (this.colCount <= 1) {
			this.items.removeProperty('style');
			this.element.addClass('no-columns');

			return;
		} else {
			this.element.removeClass('no-columns');
		}

		// Position the items
		this.items.each(this._positionItem, this);

		console.log(this);

		//this._organizeGroups();

		// Calculate values
		//this._calculateHeights();

		// Loop through each item and position
		//this._positionItems();
	},

	_calculateColumns: function() {
		var wrapperWidth = this.element.getSize().x,
			colWidth = this.options.width,
			gutter = this.options.gutter,
			cols = Math.max(Math.floor(wrapperWidth / colWidth), 1),
			colsWidth = (cols * colWidth) + (gutter * (cols - 1)),
			diff;

		if (cols > 1) {
			if (colsWidth > wrapperWidth) {
				diff = colsWidth - wrapperWidth;
				colWidth -= Math.floor(diff / cols);

			} else if (colsWidth < wrapperWidth) {
				diff = wrapperWidth - colsWidth;
				colWidth += Math.floor(diff / cols)
			}
		}

		this.wrapperWidth = wrapperWidth;
		this.colWidth = colWidth;
		this.colCount = cols;

		// Prepare for height calculation
		this.colHeights = [];

		while (cols--) {
			this.colHeights.push(0);
		}
	}.protect(),

	_calculateHeights: function() {
		/*var colHeights = [],
			colHeights = [],
			cols = this.colCount,
			gutter = this.options.gutter;

		this.items.each(function(col, i) {
			var h = col.getSize().y + gutter,
				c = (i % cols);

			colHeights.push(h);

			if (!colHeights[c]) {
				colHeights[c] = 0;
			}

			colHeights[c] += h;
		});

		this.element.setStyle('height', Math.max.apply(null, colHeights));

		// Sort the items by height
		var data = [], sorted = [];

		colHeights.each(function(height, i) {
			data.push({
				height: height,
				index: i
			});
		});

		data.sort(function(a, b) {
			return b.height - a.height;
		});

		for (var i = 0, x = 0, l = data.length, p; i < l; i += cols) {
			p = data.slice(i, i + cols);

			if (x % 2 !== 0) {
				p = p.reverse();
			}

			sorted = sorted.concat(p);
			x++;
		}

		this.colData = sorted;
		this.colHeights = colHeights;*/
	}.protect(),

	_organizeGroups: function() {
		var groups = [],
			col = 0,
			size;

		this.items.each(function(item, i) {
			size = item.getSize();
		});

		console.log(this);
	}.protect(),

	_positionItem: function(item, index) {
		var size = item.getSize(),
			colSpan,
			groupCount,
			groupY,
			groupColY;

		// How many columns does this item span?
		colSpan = Math.min(Math.ceil(size.x / this.colWidth), this.colCount);

		// Only 1 column
		if (colSpan === 1) {
			groupY = this.colHeights;

		// Multiple columns
		} else {
			groupCount = this.colCount + 1 - colSpan;
			groupY = [];

			for (var x = 0; x < groupCount; x++) {
				groupColY = this.colHeights.slice(x, x + colSpan);
				groupY[x] = Math.max.apply(Math, groupColY);
			}
		}

		var minY = Math.min.apply(Math, groupY),
			shortCol = 0;

		// Find index of short column, the first from the left
		for (var i=0, len = groupY.length; i < len; i++) {
			if ( groupY[i] === minY ) {
				shortCol = i;
				break;
			}
		}

		var position = {
			top: minY
		};
		position[this.options.rtl ? 'right' : 'left'] = this.colWidth * shortCol;

		// apply setHeight to necessary columns
		var setHeight = minY + size.y,
			setSpan = this.cols + 1 - len;

		for ( i=0; i < setSpan; i++ ) {
			this.colHeights[ shortCol + i ] = setHeight;
		}

		/*var colsInCols = [],
			colWidth = this.colWidth,
			top,
			left,
			cols = this.colCount,
			c; // current column

		this.itemData.each(function(data, i) {
			c = (i % cols);
			top = 0;
			left = 0;

			// Add top margin based on how many cols are already in the column
			if (colsInCols[c]) {
				for (var x = 0, l = colsInCols[c].length; x < l; x++) {
					top += colsInCols[c][x];
				}
			} else {
				colsInCols[c] = [];
			}

			colsInCols[c].push(data.height);

			// Add left margin and gutter based on how many columns
			if (c > 0) {
				left = (colWidth + this.options.gutter) * c;
			}

			this.cols[data.index].setStyles({
				position: 'absolute',
				left: left,
				top: top,
				width: colWidth
			});
		}.bind(this));*/
	},

	// TODO add throttling
	_resize: function() {
		this.render();
	}

});

/**
 * Enable a masonry grid on an element by calling masonry().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 * 		$('masonry-id').masonry({
 * 			width: 100
 * 		});
 *
 * @param {Object} [options]
 * @returns {Titon.Masonry}
 */
Element.implement('masonry', function(options) {
	if (this.$masonry) {
		return this.$masonry;
	}

	this.$masonry = new Titon.Masonry(this, options);

	return this.$masonry;
});

})();