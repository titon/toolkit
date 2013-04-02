/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

/**
 * Creates nested flyout menus that appear below an element that activates it.
 *
 * @uses	Titon
 * @uses	Titon.Module
 * @uses	Titon/Class.Timers
 * @uses	Core
 * @uses	More/Class.Binds
 * @uses	More/Element.Measure
 * @uses	More/Array.Extras
 */
Titon.Flyout = new Class({
	Extends: Titon.Module,
	Implements: [Class.Timers],
	Binds: ['_listen'],

	/**
	 * The current menu URL being displayed.
	 */
	current: null,

	/**
	 * Raw data response.
	 */
	data: [],

	/**
	 * Mapping of data indexed by URL.
	 */
	dataMap: {},

	/**
	 * Collection of menu elements indexed by URL.
	 */
	elements: {},

	/**
	 * Is the event mode a click?
	 */
	isClick: false,

	/**
	 * Default options.
	 *
	 *	fade			- (boolean) Will fade the menus in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	className		- (string) Class name to append to a menu when it is shown
	 *	getUrl			- (string) Attribute to read the URL from
	 *	xOffset			- (int) Additional margin on the X axis
	 *	yOffset			- (int) Additional margin on the Y axis
	 *	showDelay		- (int) The delay in milliseconds before the menu shows
	 *	hideDelay		- (int) The delay in milliseconds before the menu hides
	 *	itemLimit		- (int) How many items before splitting the lists
	 *	context			- (element) The element the menus will display in (defaults body)
	 *	contentElement	- (string) CSS query for the element within the template that the <ul> menu will be injected
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	parseTemplate	- (boolean) Whether to parse the template during initialization
	 *	onHide			- (function) Callback to trigger when a menu is hidden
	 *	onShow			- (function) Callback to trigger when a menu is shown
	 *	onPosition		- (function) Callback to trigger when a menu is positioned
	 */
	options: {
		fade: false,
		fadeDuration: 250,
		mode: 'hover',
		className: '',
		getUrl: 'href',
		xOffset: 0,
		yOffset: 0,
		showDelay: 350,
		hideDelay: 1000,
		itemLimit: 15,
		context: null,
		contentElement: '.flyout',
		template: '<div class="flyout"></div>',
		parseTemplate: false,

		// Events
		onHide: null,
		onShow: null,
		onPosition: null
	},

	/**
	 * Initialize all options and events and fetch data from the defined URL.
	 *
	 * @param {String} query
	 * @param {String} url
	 * @param {Object} options
	 */
	initialize: function(query, url, options) {
		this.parent(options);
		this.query = query;
		this.isClick = (this.options.mode !== 'hover');

		// Load data from the URL
		if (url) {
			new Request.JSON({
				url: url,
				secure: true,
				onSuccess: this.load.bind(this)
			}).get();
		}

		// Set timers
		this.addTimers({
			show: this._position,
			hide: this.hide
		});

		// Set events
		this.disable().enable();

		if (!this.isClick) {
			$$(query)
				.addEvent('mouseenter', function() {
					this.clearTimer('hide').startTimer('show', this.options.showDelay);
				}.bind(this))
				.addEvent('mouseleave', function() {
					this.clearTimer('show').startTimer('hide', this.options.showDelay);
				}.bind(this));
		}
	},

	/**
	 * Disable flyout events.
	 *
	 * @return {Titon.Flyout}
	 */
	disable: function() {
		$(this.options.context || document.body).removeEvent((this.isClick ? 'click' : 'mouseenter') + ':relay(' + this.query + ')', this._listen);

		return this;
	},

	/**
	 * Enable flyout events.
	 *
	 * @return {Titon.Flyout}
	 */
	enable: function() {
		$(this.options.context || document.body).addEvent((this.isClick ? 'click' : 'mouseenter') + ':relay(' + this.query + ')', this._listen);

		return this;
	},

	/**
	 * Hide the currently shown menu.
	 */
	hide: function() {
		this.clearTimers();

		this.node.removeClass('active');

		if (!this.current || !this.elements[this.current].isVisible()) {
			return;
		}

		if (this.options.fade) {
			this.elements[this.current].fadeOut(this.options.fadeDuration);
		} else {
			this.elements[this.current].hide();
		}

		this.node = null;
		this.current = null;

		this.fireEvent('hide');
	},

	/**
	 * Load the data into the class and save a mapping of it.
	 *
	 * @param {Object} data
	 * @param {int} depth
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
		// Only hide if not the same target
		var target = this._getTarget(node);

		if (this.current && target !== this.current) {
			this.hide();

		} else if (this.isVisible()) {
			return;
		}

		this.node = node;

		// Find the menu, else create it
		if (!this._getMenu()) {
			return;
		}

		this.node.addClass('active');

		// Call show before position if click mode
		this.fireEvent('show');

		// Display immediately if click
		if (this.isClick) {
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

		if (limit && data.children.length > limit) {
			groups = data.children.chunk(limit);
		} else {
			groups.push(data.children);
		}

		for (var g = 0, group; group = groups[g]; g++) {
			ul = new Element('ul');

			for (var i = 0, l = group.length, child; i < l; i++) {
				child = group[i];

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
				}

				if (child.attributes) {
					tag.set(child.attributes);
				}

				// Add icon
				new Element('span').addClass(child.icon || '').inject(tag, 'top');

				// Build list
				li = new Element('li');

				if (child.className) {
					li.addClass(child.className);
				}

				li.grab(tag).inject(ul);

				if (child.children && child.children.length) {
					this._buildMenu(li, child);

					li.addClass('children')
						.addEvent('mouseenter', this._positionChild.bind(this, li))
						.addEvent('mouseleave', function() {
							this.removeClass('opened').getElement(target).hide();
						});
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

		menu.grab(new Element('span.clear'));
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

		if (this.elements[target]) {
			this.current = target;

			return this.elements[target];
		}

		if (this.dataMap[target]) {
			var menu = this._buildMenu(document.body, this.dataMap[target]);

			if (!menu) {
				return null;
			}

			if (!this.isClick) {
				menu.hide()
					.addEvent('mouseenter', function() {
						this.clearTimer('hide');
					}.bind(this))
					.addEvent('mouseleave', function() {
						this.startTimer('hide', this.options.hideDelay);
					}.bind(this));
			}

			this.current = target;
			this.elements[target] = menu;

			return this.elements[target];
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
	 * Event callback for node mouseover or click.
	 *
	 * @param {Event} e
	 * @param {Element} node
	 */
	_listen: function(e, node) {
		e.stop();

		if (this.isVisible()) {
			if (this.isClick) {
				this.hide();
			}

			return;
		}

		this.show(node);
	},

	/**
	 * Position the menu below the target node.
	 *
	 * @private
	 */
	_position: function() {
		var target = this.current,
			options = this.options;

		if (!this.elements[target]) {
			return;
		}

		var menu = this.elements[target],
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
		});

		if (options.fade) {
			menu.fadeIn(options.fadeDuration);
		} else {
			menu.show();
		}

		this.fireEvent('position');
	},

	/**
	 * Position the child menu dependent on the position in the page.
	 *
	 * @param {Element} parent
	 * @private
	 */
	_positionChild: function(parent) {
		var menu = parent.getElement(this.options.contentElement);

		if (!menu) {
			return;
		}

		parent.addClass('opened');

		// Reverse menu if below half way
		if (parent.getCoordinates().top > (window.getScrollSize().y / 2)) {
			var height = menu.getDimensions().height - parent.getHeight();

			menu.setStyle('top', '-' + height + 'px');
		} else {
			menu.setStyle('top', 0);
		}

		menu.show();

		// Alter width
		var dims = menu.getComputedSize();

		menu.setStyle('width', (
			menu.getElements('ul').getWidth().sum() +
			dims['border-left-width'] + dims['border-right-width'] +
			dims['padding-left'] + dims['padding-right']
		) + 'px');
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
 * @param {Object} options
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