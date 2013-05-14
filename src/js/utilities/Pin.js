/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Pin = new Class({
	Extends: Titon.Module,
	Binds: ['_resize', '_scroll'],

	/** The current window width and height. */
	viewport: null,

	/**
	 * Default options.
	 *
	 *	position	- (string) What type of positioning to use: absolute, static, fixed
	 *	location	- (string) Whether the pin should be located on the left or right of the parent
	 *	xOffset		- (int) Additional margin on the X axis
	 *	yOffset		- (int) Additional margin on the Y axis
	 *	throttle	- (int) The amount in milliseconds to update pin location
	 *	onScroll	- (function) Callback triggered when page is scrolled
	 *	onResize	- (function) Callback triggered when page is resized
	 */
	options: {
		location: 'right',
		xOffset: 0,
		yOffset: 0,
		throttle: 0,

		// Events
		onScroll: null,
		onResize: null
	},

	/**
	 * Pin the element and enable events.
	 *
	 * @param {String} id
	 * @param {Object} options
	 */
	initialize: function(id, options) {
		options = options || {};
		options.templateFrom = id;
		options.template = false;

		this.parent(id, options);

		// Cache the element coordinates
		this.viewport = window.getSize();
		this.elementSize = this.element.getCoordinates();
		this.parentSize = this.element.getParent().getCoordinates();

		// Enable pin if the parent is larger than the child
		this.disable();

		if (this.parentSize.height >= (this.elementSize.height * 2)) {
			this.enable();
		}

		this.fireEvent('init');

		window.addEvent('resize', this._resize);
	},

	/**
	 * Provide an empty callback to handle functionality during browser resizing.
	 * This allows pin functionality to be enabled or disabled for responsive layouts.
	 *
	 * @private
	 */
	_resize: function() {
		this.viewport = window.getSize();

		this.fireEvent('resize');
	},

	/**
	 * While the viewport is being scrolled, the element should move vertically along with it.
	 * The element should also stay contained within the parent element.
	 *
	 * @private
	 */
	_scroll: function() {
		var options = this.options,
			eSize = this.elementSize,
			pSize = this.parentSize,
			wScroll = window.getScroll(),
			pos = {},
			x = 0,
			y = 0;

		// Scroll reaches the top or bottom of the parent
		if (wScroll.y > pSize.top) {
			x = options.xOffset;
			y = options.yOffset;

			var elementMaxPos = wScroll.y + eSize.height,
				parentMaxHeight = pSize.height + pSize.top;

			if (elementMaxPos >= parentMaxHeight) {
				y += (pSize.height - eSize.height);
			} else {
				y += (wScroll.y - pSize.top);
			}
		}

		// Position the element
		pos.position = 'absolute';
		pos[options.location] = x;
		pos.top = y;

		this.element.setStyles(pos);

		this.fireEvent('scroll');
	},

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.Tabs}
	 */
	_toggleEvents: function(on) {
		if (!this.query) {
			return this;
		}

		if (on) {
			window.addEvent('scroll:throttle(' + this.options.throttle + ')', this._scroll);
		} else {
			window.removeEvent('scroll:throttle(' + this.options.throttle + ')', this._scroll);
		}

		return this;
	}.protect()

});

/**
 * All instances loaded via factory().
 */
Titon.Pin.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} id
 * @param {Object} options
 * @return {Titon.Pin}
 */
Titon.Pin.factory = function(id, options) {
	if (Titon.Pin.instances[id]) {
		return Titon.Pin.instances[id];
	}

	var instance = new Titon.Pin(id, options);

	Titon.Pin.instances[id] = instance;

	return instance;
};

})();