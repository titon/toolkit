/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Creates a nested flyout menu that appears below a node that activates it.
 *
 * @version	0.1
 * @uses	Titon
 * @uses	Titon.Module
 * @uses	Core
 */
Titon.Flyout = new Class({
	Extends: Titon.Module,

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
	 * Is a menu currently visible?
	 */
	isVisible: false,

	/**
	 * Current node that activated the tooltip.
	 */
	node: null,

	/**
	 * Query selector used for activation.
	 */
	query: null,

	/**
	 * Timers used for show and hide delays.
	 */
	showTimer: null,
	hideTimer: null,

	/**
	 * Default options.
	 *
	 *	fade			- (boolean) Will fade the tooltips in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	className		- (string) Class name to append to a tooltip when it is shown
	 *	urlQuery		- (string) Attribute to read the URL from
	 *	xOffset			- (int) Additional margin on the X axis
	 *	yOffset			- (int) Additional margin on the Y axis
	 *	delay			- (int) The delay in milliseconds before the tooltip shows
	 *	context			- (element) The element the tooltips will display in (defaults body)
	 *	onHide			- (function) Callback to trigger when a tooltip is hidden
	 *	onShow			- (function) Callback to trigger when a tooltip is shown
	 *	onPosition		- (function) Callback to trigger when a tooltip is positioned
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	parseTemplate	- (boolean) Whether to parse the template during initialization
	 */
	options: {
		fade: false,
		fadeDuration: 250,
		mode: 'hover',
		className: '',
		urlQuery: 'href',
		xOffset: 0,
		yOffset: 0,
		delay: 500,
		context: null,
		onHide: null,
		onShow: null,
		onPosition: null,
		template: '<div class="flyout"></div>',
		parseTemplate: false
	},

	/**
	 * Initialize all options and events and fetch data from the defined URL.
	 *
	 * @param {string} query
	 * @param {string} url
	 * @param {object} options
	 */
	initialize: function(query, url, options) {
		this.parent(options);
		this.query = query;

		// Load data from the URL
		if (url) {
			new Request.JSON({
				url: url,
				secure: true,
				onSuccess: this.load.bind(this)
			}).get();
		}

		// Set events
		this.isClick = (this.options.mode !== 'hover');

		var event = (this.isClick ? 'click' : 'mouseenter') + ':relay(' + query + ')',
			callback = this.listen.bind(this);

		$(this.options.context || document.body)
			.removeEvent(event, callback)
			.addEvent(event, callback);

		if (!this.isClick) {
			$$(query)
				.addEvent('mouseenter', function() {
					window.clearTimeout(this.hideTimer);
					this.showTimer = window.setTimeout(this._position.bind(this), this.options.delay);
				}.bind(this))
				.addEvent('mouseleave', function() {
					window.clearTimeout(this.showTimer);
					this.hideTimer = window.setTimeout(this.hide.bind(this), this.options.delay);
				}.bind(this));
		}
	},

	/**
	 * Hide the currently shown menu.
	 */
	hide: function() {
		window.clearTimeout(this.hideTimer);
		window.clearTimeout(this.showTimer);

		if (!this.isVisible || !this.current) {
			return;
		}

		if (this.options.fade) {
			this.elements[this.current].fadeOut(this.options.fadeDuration, false);
		} else {
			this.elements[this.current].hide();
		}

		this.isVisible = false;
		this.node = null;
		this.current = null;

		this.fireEvent('hide');
	},

	/**
	 * Event callback for node mouseover or click.
	 *
	 * @param {event} e
	 * @param {Element} node
	 */
	listen: function(e, node) {
		if (this.isClick) {
			e.stop();

			if (this.isVisible) {
				this.hide();
				return;
			}
		}

		this.show(node);
	},

	/**
	 * Load the data into the class and save a mapping of it.
	 *
	 * @param {object} data
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
		this.node = node;

		// Only hide if not the same target
		var target = this._getTarget();

		if (target !== this.current) {
			this.hide();
			this.node = node;

		} else if (this.isVisible) {
			return;
		}

		// Find the menu, else create it
		if (!this._getMenu()) {
			return;
		}

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
	 * @param {object} data
	 * @return {Element}
	 */
	_buildMenu: function(parent, data) {
		var menu = this.parseTemplate(this.options.template),
			ul = new Element('ul'),
			li,
			tag;

		if (this.options.className) {
			menu.addClass(this.options.className);
		}

		for (var i = 0, l = data.children.length, child; i < l; i++) {
			child = data.children[i];

			// Build tag
			if (data.url) {
				tag = new Element('a', {
					text: child.title,
					href: child.url
				});
			} else {
				tag = new Element('span', {
					text: child.title
				});
			}

			// Build list
			li = new Element('li');

			if (child.className) {
				li.addClass(child.className);
			}

			li.grab(tag).inject(ul);

			if (child.children) {
				this._buildMenu(li, child);
			}
		}

		menu.grab(ul).inject(parent);

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

			if (!this.isClick) {
				menu.hide()
					.addEvent('mouseenter', function() {
						window.clearTimeout(this.hideTimer);
					}.bind(this))
					.addEvent('mouseleave', function() {
						this.hideTimer = window.setTimeout(this.hide.bind(this), this.options.delay);
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
	 * @return {string}
	 */
	_getTarget: function() {
		return this.node.get(this.options.urlQuery) || this.node.get('href');
	}.protect(),

	/**
	 * Position the menu below the target node.
	 *
	 * @private
	 */
	_position: function() {
		var coords = this.node.getCoordinates(),
			target = this.current,
			options = this.options;

		if (!this.elements[target]) {
			return;
		}

		this.elements[target].setPosition({
			x: coords.left + options.xOffset,
			y: coords.top + options.yOffset + coords.height
		});

		if (options.fade) {
			this.elements[target].fadeIn(options.fadeDuration);
		} else {
			this.elements[target].show();
		}

		this.isVisible = true;
		this.fireEvent('position');
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Flyout.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {string} query
 * @param {string} url
 * @param {object} options
 */
Titon.Flyout.factory = function(query, url, options) {
	if (Titon.Flyout.instances[query]) {
		return Titon.Flyout.instances[query];
	}

	var instance = new Titon.Flyout(query, url, options);

	Titon.Flyout.instances[query] = instance;

	return instance;
};