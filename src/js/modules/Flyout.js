/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Flyout = new Class({
	Extends: Titon.Component,
	Implements: [Timers],

	/** The current menu URL being displayed. */
	current: null,

	/** Collection of menu elements. */
	menus: {},

	/** Raw data response. */
	data: [],

	/** Mapping of data indexed by URL. */
	dataMap: {},

	/**
	 * Default options.
	 *
	 *	getUrl			- (string) Attribute to read the URL from
	 *	xOffset			- (int) Additional margin on the X axis
	 *	yOffset			- (int) Additional margin on the Y axis
	 *	showDelay		- (int) The delay in milliseconds before the menu shows
	 *	hideDelay		- (int) The delay in milliseconds before the menu hides
	 *	itemLimit		- (int) How many items before splitting the lists
	 *	contentElement	- (string) CSS query for the element within the template that the <ul> menu will be injected into
	 *	onHideChild		- (function) Callback to trigger when a child menu is hidden
	 *	onShowChild		- (function) Callback to trigger when a child menu is shown
	 */
	options: {
		mode: 'hover',
		getUrl: 'href',
		xOffset: 0,
		yOffset: 0,
		showDelay: 350,
		hideDelay: 1000,
		itemLimit: 15,
		contentElement: '.flyout',
		template: '<div class="flyout"></div>',
		multiElement: true,

		// Events
		onHideChild: null,
		onShowChild: null
	},

	/**
	 * Initialize all options and events and fetch data from the defined URL.
	 *
	 * @param {String} query
	 * @param {String} url
	 * @param {Object} [options]
	 */
	initialize: function(query, url, options) {
		this.parent(options);
		this.bindTo(query);

		// Load data from the URL
		new Request.JSON({
			url: url,
			secure: true,
			onSuccess: this.load.bind(this)
		}).get();

		// Set timers
		this.addTimers({
			show: this._position,
			hide: this._hide
		});

		// Set events
		this.disable().enable();

		// Handles keeping menu open even if mouse exits the context
		if (this.options.mode === 'hover') {
			$$(query)
				.addEvent('mouseenter', function() {
					this.clearTimer('hide').startTimer('show', this.options.showDelay);
				}.bind(this))
				.addEvent('mouseleave', function() {
					this.clearTimer('show').startTimer('hide', this.options.showDelay);
				}.bind(this));
		}

		this.fireEvent('init');
	},

	/**
	 * Hide the currently shown menu.
	 */
	hide: function() {
		this.clearTimers();

		// Must be called even if the menu is hidden
		this.node.removeClass(Titon.options.activeClass);

		if (!this.current || !this.isVisible()) {
			return;
		}

		this.menus[this.current].conceal();
		this.fireEvent('hide');

		// Reset last
		this.current = null;
	},

	/**
	 * Return true if the current menu exists and is visible.
	 *
	 * @return {bool}
	 */
	isVisible: function() {
		if (this.current && this.menus[this.current]) {
			this.element = this.menus[this.current];
		}

		return this.parent();
	},

	/**
	 * Load the data into the class and save a mapping of it.
	 *
	 * @param {Object} data
	 * @param {int} [depth]
	 */
	load: function(data, depth) {
		depth = depth || 0;

		// If root, store the data
		if (depth === 0) {
			this.data = data;
		}

		// Store the data indexed by URL
		this.dataMap[data.url] = data;

		if (data.children) {
			for (var i = 0, l = data.children.length; i < l; i++) {
				this.load(data.children[i], depth + 1);
			}
		}
	},

	/**
	 * Show the menu below the node.
	 *
	 * @param {Element} node
	 */
	show: function(node) {
		var target = this._getTarget(node);

		// When jumping from one node to another
		// Immediately hide the other menu and start the timer for the current one
		if (this.current && target !== this.current) {
			this.hide();
			this.startTimer('show', this.options.showDelay);
		}

		this.node = node;

		// Find the menu, else create it
		if (!this._getMenu()) {
			return;
		}

		this.node.addClass(Titon.options.activeClass);

		// Display immediately if click
		if (this.options.mode === 'click') {
			this._position();
		}
	},

	/**
	 * Build a nested list menu using the data object.
	 *
	 * @private
	 * @param {Element} parent
	 * @param {Object} data
	 * @return {Element}
	 */
	_buildMenu: function(parent, data) {
		if (!data.children || !data.children.length) {
			return null;
		}

		var menu = this.parseTemplate(this.options.template),
			groups = [],
			ul,
			li,
			tag,
			target = this.options.contentElement,
			limit = this.options.itemLimit;

		if (this.options.className) {
			menu.addClass(this.options.className);
		}

		if (parent === document.body) {
			menu.addClass('flyout-root');
		}

		if (limit && data.children.length > limit) {
			groups = data.children.chunk(limit);
		} else {
			groups.push(data.children);
		}

		for (var g = 0, group; group = groups[g]; g++) {
			ul = new Element('ul');

			for (var i = 0, l = group.length, child; i < l; i++) {
				child = group[i];
				li = new Element('li');

				// Build tag
				if (child.url) {
					tag = new Element('a', {
						text: child.title,
						href: child.url
					});
				} else {
					tag = new Element('span', {
						text: child.title
					});

					li.addClass('heading');
				}

				if (child.attributes) {
					tag.set(child.attributes);
				}

				// Add icon
				new Element('span').addClass(child.icon || 'caret-right').inject(tag, 'top');

				// Build list
				if (child.className) {
					li.addClass(child.className);
				}

				li.grab(tag).inject(ul);

				if (child.children && child.children.length) {
					this._buildMenu(li, child);

					li.addClass('has-children')
						.addEvent('mouseenter', this._positionChild.bind(this, li))
						.addEvent('mouseleave', this._hideChild.bind(this, li));
				}
			}

			if (target) {
				if (target.substr(0, 1) === '.' && menu.hasClass(target.remove('.'))) {
					menu.grab(ul);
				} else {
					menu.getElement(target).grab(ul);
				}
			} else {
				menu.grab(ul);
			}
		}

		menu.inject(parent);

		return menu;
	}.protect(),

	/**
	 * Get the menu if it exists, else build it and set events.
	 *
	 * @private
	 * @return {Element}
	 */
	_getMenu: function() {
		var target = this._getTarget();

		if (this.menus[target]) {
			this.current = target;

			return this.menus[target];
		}

		if (this.dataMap[target]) {
			var menu = this._buildMenu(document.body, this.dataMap[target]);

			if (!menu) {
				return null;
			}

			menu.conceal();

			if (this.options.mode === 'hover') {
				menu.addEvents({
					mouseenter: function() {
						this.clearTimer('hide');
					}.bind(this),
					mouseleave: function() {
						this.startTimer('hide', this.options.hideDelay);
					}.bind(this)
				});
			}

			this.current = target;
			this.menus[target] = menu;

			return this.menus[target];
		}

		return null;
	}.protect(),

	/**
	 * Get the target URL to determine which menu to show.
	 *
	 * @private
	 * @param {Element} node
	 * @return {String}
	 */
	_getTarget: function(node) {
		node = node || this.node;

		return this.getValue(node, this.options.getUrl) || node.get('href');
	}.protect(),

	/**
	 * Hide the child menu after exiting parent li.
	 *
	 * @private
	 * @param {Element} parent
	 */
	_hideChild: function(parent) {
		parent.removeClass(Titon.options.openClass);
		parent.getChildren(this.options.contentElement).removeProperty('style');

		this.fireEvent('hideChild', parent);
	},

	/**
	 * Position the menu below the target node.
	 *
	 * @private
	 */
	_position: function() {
		var target = this.current,
			options = this.options;

		if (!this.menus[target]) {
			return;
		}

		var menu = this.menus[target],
			height = menu.getDimensions().height,
			coords = this.node.getCoordinates(),
			x = coords.left + options.xOffset,
			y = coords.top + options.yOffset + coords.height,
			windowScroll = window.getScrollSize();

		// If menu goes below half page, position it above
		if (y > (windowScroll.y / 2)) {
			y = coords.top - options.yOffset - height;
		}

		menu.setPosition({
			x: x,
			y: y
		}).reveal();

		this.fireEvent('show');
	},

	/**
	 * Position the child menu dependent on the position in the page.
	 *
	 * @private
	 * @param {Element} parent
	 */
	_positionChild: function(parent) {
		var menu = parent.getElement(this.options.contentElement);

		if (!menu) {
			return;
		}

		parent.addClass(Titon.options.openClass);

		// Alter width because of columns
		menu.setStyle('width', menu.getChildren('ul').getWidth().sum()  + 'px');

		// Get sizes after menu positioning
		var windowScroll = window.getScrollSize(),
			windowSize = window.getCoordinates(),
			parentSize = parent.getCoordinates(),
			childSize = menu.getCoordinates();

		// Display menu horizontally on opposite side if it spills out of viewport
		var hWidth = parentSize.right + childSize.width;

		if (hWidth >= windowSize.width) {
			menu.setStyle('left', '-' + childSize.width + 'px');
		} else {
			menu.setStyle('left', parentSize.width + 'px');
		}

		// Reverse menu vertically if below half way fold
		if (parentSize.top > (windowScroll.y / 2)) {
			menu.setStyle('top', '-' + (childSize.height - parentSize.height) + 'px');
		} else {
			menu.setStyle('top', 0);
		}

		this.fireEvent('showChild', parent);
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Flyout.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {String} url
 * @param {Object} [options]
 * @return {Titon.Flyout}
 */
Titon.Flyout.factory = function(query, url, options) {
	if (Titon.Flyout.instances[query]) {
		return Titon.Flyout.instances[query];
	}

	var instance = new Titon.Flyout(query, url, options);

	Titon.Flyout.instances[query] = instance;

	return instance;
};

})();