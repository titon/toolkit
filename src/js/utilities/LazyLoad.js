/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

/**
 * Provides an easy way to lazy-load images while scrolling to conserve bandwidth and improve page loading times.
 */
 Titon.LazyLoad = new Class({
	Implements: [Events, Options],
	Binds: ['load', 'loadAll'],

	/**
	 * Query selector used for module activation.
	 */
	query: null,

	/**
	 * Have all elements been force loaded?
	 */
	isLoaded: false,

	/**
	 * Default options.
	 *
	 *	fade			- (int) Will fade the items in and out in milliseconds
	 *	forceLoad		- (boolean) Will force all items to load after a delay
	 *	delay			- (int) The delay in milliseconds before items are force loaded
	 *	threshold		- (int) The threshold in pixels to load images outside the viewport
	 *	createStyles	- (boolean) Will automatically create CSS styles related to lazy loading
	 *	context			- (element) The element the lazy loading triggers in (defaults window)
	 *	parseTemplate	- (boolean) Whether to parse the template during initialization
	 *	onLoad			- (function) Callback to trigger when the scroll bar loads items
	 *	onLoadAll		- (function) Callback to trigger when all items are loaded
	 *	onShow			- (function) Callback to trigger when an item is shown
	 *	onShutdown		- (function) Callback to trigger when lazy loading is disabled
	 */
	options: {
		fade: false,
		forceLoad: false,
		delay: 10000,
		threshold: 150,
		createStyles: true,
		context: null,

		// Events
		onLoad: null,
		onLoadAll: null,
		onShow: null,
		onShutdown: null
	},

	/**
	 * Initialize container events, append CSS styles based on query, instantly load() elements in viewport and set force load timeout if option is true.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		this.setOptions(options);
		this.query = query;

		// Setup CSS styles
		if (this.options.createStyles) {
			var sheet = document.createElement('style');
				sheet.innerHTML  = query + ' { background: none !important; }';
				sheet.innerHTML += query + ' * { display: none !important; }';

			document.head.grab(sheet);
		}

		// Add events
		$(this.options.context || window).addEvents({
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
	 */
	shutdown: function() {
		this.isLoaded = true;

		$(this.options.context || window).removeEvents({
			scroll: this.load,
			resize: this.load
		});

		this.fireEvent('shutdown');
	},

	/**
	 * Loop over the lazy loaded elements and verify they are within the viewport.
	 *
	 * @return {boolean}
	 */
	load: function() {
		if (this.isLoaded) {
			return false;
		}

		var elements = $$(this.query);

		if (elements.length === 0) {
			this.shutdown();

			return false;
		}

		elements.each(function(node) {
			node = new Element(node);

			if (this.inViewport(node)) {
				this.show(node);
			}
		}, this);

		this.fireEvent('load');

		return true;
	},

	/**
	 * Load the remaining hidden elements and remove any container events.
	 *
	 * @return {boolean}
	 */
	loadAll: function() {
		if (this.isLoaded) {
			return false;
		}

		var elements = $$(this.query);

		elements.each(function(node) {
			this.show(new Element(node));
		}, this);

		this.fireEvent('loadAll', elements);

		this.shutdown();

		return true;
	},

	/**
	 * Show or fade in the element by removing the lazy load class.
	 *
	 * @param {Element} node
	 */
	show: function(node) {
		node.removeClass(this.query.remove('.'));

		if (this.options.fade) {
			node.getChildren().fadeIn(this.options.fade);
		}

		this.fireEvent('show', node);
	},

	/**
	 * Verify that the element is within the current browser viewport.
	 *
	 * @param {Element} node
	 * @return {boolean}
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
 * @param {Object} options
 * @return {Titon.LazyLoad}
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