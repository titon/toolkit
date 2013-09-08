/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.LazyLoad = new Class({
	Extends: Titon.Component,
	Binds: ['load', 'loadAll'],

	/** Have all elements been force loaded? */
	isLoaded: false,

	/** Count of how many have loaded */
	loaded: 0,

	/**
	 * Default options.
	 *
	 *	forceLoad		- (bool) Will force all items to load after a delay
	 *	delay			- (int) The delay in milliseconds before items are force loaded
	 *	threshold		- (int) The threshold in pixels to load images outside the viewport
	 *	context			- (element) The element the lazy loading triggers in (defaults window)
	 *	onLoad			- (function) Callback to trigger when the scroll bar loads items
	 *	onLoadAll		- (function) Callback to trigger when all items are loaded
	 *	onShow			- (function) Callback to trigger when an item is shown
	 *	onShutdown		- (function) Callback to trigger when lazy loading is disabled
	 */
	options: {
		forceLoad: false,
		delay: 10000,
		threshold: 150,
		context: null,

		// Events
		onLoad: null,
		onLoadAll: null,
		onShow: null,
		onShutdown: null
	},

	/**
	 * Initialize container events, instantly load() elements in viewport and set force load timeout if option is true.
	 *
	 * @param {String} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		this.parent(options);
		this.bindTo(query);
		this.setElements(query);

		// Exit if no elements
		if (!this.element.length) {
			return;
		}

		// Add events
		document.id(this.options.context || window).addEvents({
			scroll: this.load,
			resize: this.load
		});

		// Load elements within viewport
		window.addEvent('domready', function() {
			this.load();

			// Set force load on DOM ready
			if (this.options.forceLoad) {
				window.setTimeout(this.loadAll, this.options.delay);
			}
		}.bind(this));
	},

	/**
	 * When triggered, will shutdown the instance from executing any longer.
	 * Any container events will be removed and loading will cease.
	 *
	 * @returns {Titon.LazyLoad}
	 */
	shutdown: function() {
		this.isLoaded = true;

		document.id(this.options.context || window).removeEvents({
			scroll: this.load,
			resize: this.load
		});

		this.fireEvent('shutdown');

		return this;
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

		var elements = this.element;

		if (this.loaded === elements.length) {
			this.shutdown();

			return false;
		}

		elements.each(function(node, index) {
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
	 * @returns {Titon.LazyLoad}
	 */
	show: function(node, index) {
		node.removeClass(this.query.remove('.'));

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
	}

});

/**
 * All instances loaded via factory().
 */
Titon.LazyLoad.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} [options]
 * @returns {Titon.LazyLoad}
 */
Titon.LazyLoad.factory = function(query, options) {
	if (Titon.LazyLoad.instances[query]) {
		return Titon.LazyLoad.instances[query];
	}

	var instance = new Titon.LazyLoad(query, options);

	Titon.LazyLoad.instances[query] = instance;

	return instance;
};

})();