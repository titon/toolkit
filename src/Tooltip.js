/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Creates dynamic tooltips that will display at a specific node or the mouse cursor.
 *
 * @version	0.13
 * @uses	Titon
 * @uses	Core
 * @uses	More/Element.Position
 *
 * @changelog
 *	v0.13
 *		Renamed duration option to fadeDuration
 *		Updated factory() to return instance if it exists
 *	v0.12
 *		Fixed minor bugs
 *		Supplied the node for element events
 *	v0.11
 *		Added a top level hide() method to hide all instances on a page
 *	v0.10
 *		Disabled fade option by default
 *		Added a duration option to handle fade animation
 *		Switched mouseover to mouseenter and mouseout to mouseleave
 *		Fixed a bug with document.body being passed as the context
 *		Fixed a bug when position mouse and mode click were used together
 *		Fixed a bug where offset values weren't being used correctly in position()
 *	v0.9
 *		Added a context option (defaults to document)
 *		Added a mode option to toggle between hover and click
 *	v0.8
 *		Fixed some incorrect customOptions usage
 *		Node now uses getOptions('tooltip')
 *	v0.7
 *		Fixed incorrect fireEvent() in position()
 *		Made factory() use objects instead of arrays
 *	v0.6
 *		Added fade support
 *		Added a delay time for show/hide
 */
Titon.Tooltip = new Class({
	Implements: [Events, Options],

	/**
	 * Query selector used for these tooltips.
	 */
	query: null,

	/**
	 * DOM objects created to hold the tooltip content.
	 */
	object: null,
	objectHead: null,
	objectBody: null,

	/**
	 * Current node that activated the tooltip.
	 */
	node: null,

	/**
	 * Current tooltip title and content.
	 */
	title: null,
	content: null,

	/**
	 * A cache of all AJAX calls, indexed by the URL.
	 */
	cache: {},

	/**
	 * Dynamic options that change per node.
	 */
	customOptions: {},

	/**
	 * Default options.
	 *
	 *	ajax			- (bool) The tooltip uses the target as an AJAX call
	 *	fade			- (bool) Will fade the tooltips in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	className		- (string) Class name to append to a tooltip when it is shown
	 *	position		- (string) The position to display the tooltip over the element
	 *	showLoading		- (bool) Will display the loading text while waiting for AJAX calls
	 *	showTitle		- (bool) Will display the element title in the tooltip
	 *	titleQuery		- (string) Attribute to read the title from
	 *	contentQuery	- (string) Attribute to read the content from
	 *	xOffset			- (int) Additional margin on the X axis
	 *	yOffset			- (int) Additional margin on the Y axis
	 *	delay			- (int) The delay in milliseconds before the tooltip shows
	 *	context			- (element) The element the tooltips will display in (defaults body)
	 *	onHide			- (function) Callback to trigger when a tooltip is hidden
	 *	onShow			- (function) Callback to trigger when a tooltip is shown
	 *	onPosition		- (function) Callback to trigger when a tooltip is positioned
	 */
	options: {
		ajax: false,
		fade: false,
		fadeDuration: 250,
		mode: 'hover',
		className: '',
		position: 'topRight',
		showLoading: true,
		showTitle: true,
		titleQuery: 'title',
		contentQuery: 'data-tooltip',
		xOffset: 0,
		yOffset: 0,
		delay: 0,
		context: null,
		onHide: null,
		onShow: null,
		onPosition: null
	},

	/**
	 * Is the tooltip currently visible?
	 */
	isVisible: false,

	/**
	 * Initialize tooltips for the passed DOM query.
	 * Will apply event delegation and generate the HTML required for this tooltip instance.
	 *
	 * @param {string} query
	 * @param {object} options
	 */
	initialize: function(query, options) {
		this.setOptions(options);
		this.query = query;

		var event = (this.options.mode === 'hover' ? 'mouseenter' : 'click'),
			context = $(this.options.context || document.body),
			listenCallback = this.listen.bind(this);

		context
			.removeEvent(event + ':relay(' + query + ')', listenCallback)
			.addEvent(event + ':relay(' + query + ')', listenCallback);

		var outer = new Element('div.' + Titon.options.prefix + 'tooltip'),
			inner = new Element('div.tooltip-inner'),
			head = new Element('div.tooltip-head'),
			body = new Element('div.tooltip-body');

		inner.grab(head).grab(body);
		outer.grab(inner).inject(document.body);

		this.object = outer;
		this.objectHead = head;
		this.objectBody = body;
	},

	/**
	 * Callback to position the tooltip at the mouse cursor.
	 *
	 * @param {event} e
	 */
	followMouse: function(e) {
		e.stop();

		this.object.setPosition({
			x: (e.page.x + 10 + this.customOptions.xOffset),
			y: (e.page.y + 10 + this.customOptions.yOffset)
		}).fade('show').show();
	},

	/**
	 * Hide the tooltip and set all relevant values to null.
	 */
	hide: function() {
		if (!this.isVisible) {
			return;
		}

		this.isVisible = false;

		this.node.removeEvents('mousemove');
		this.node = null;
		this.title = null;
		this.content = null;

		if (this.customOptions.className) {
			this.object.removeClass(this.customOptions.className);
		}

		if (this.customOptions.fade) {
			this.object.fadeOut(this.options.fadeDuration, false);
		} else {
			this.object.removeProperty('style');
		}

		this.fireEvent('hide');
	},

	/**
	 * Event callback for tooltip element mouseover or click.
	 *
	 * @param {event} e
	 * @param {object} node
	 */
	listen: function(e, node) {
		e.stop();

		if (this.options.mode === 'click' && this.isVisible) {
			this.hide();
			return;
		}

		this.show(node);
	},

	/**
	 * Positions the tooltip relative to the current node or the mouse cursor.
	 * Additionally will apply the title/text and hide/show if necessary.
	 */
	position: function() {
		var options = this.customOptions;

		// Apply styles and content
		if (options.className) {
			this.object.addClass(options.className);
		}

		if (this.title && options.showTitle) {
			this.objectHead.set('html', this.title).show();
		} else {
			this.objectHead.hide();
		}

		if (this.content) {
			this.objectBody.set('html', this.content).show();
		} else {
			this.objectBody.hide();
		}

		// Follow the mouse
		if (options.position === 'mouse') {
			this.node
				.removeEvents('mousemove')
				.addEvent('mousemove', this.followMouse.bind(this));

		// Position accordingly
		} else {
			var position = options.position,
				edgeMap = {
					topLeft: 'bottomRight',
					topCenter: 'bottomCenter',
					topRight: 'bottomLeft',
					centerLeft: 'centerRight',
					center: 'center',
					centerRight: 'centerLeft',
					bottomLeft: 'topRight',
					bottomCenter: 'topCenter',
					bottomRight: 'topLeft'
				};

			this.object.position({
				relativeTo: this.node,
				position: position,
				edge: edgeMap[position] || 'topLeft',
				offset: {
					x: -options.xOffset,
					y: -options.yOffset
				}
			});

			window.setTimeout(function() {
				if (this.customOptions.fade) {
					this.object.fadeIn();
				} else {
					this.object.setStyle('opacity', 1);
				}
			}.bind(this), options.delay || 1);
		}

		this.isVisible = true;
		this.fireEvent('position');
	},

	/**
	 * Attempt to read a value from multiple locations.
	 * DOM storage will always take precedent.
	 *
	 * @param {string} type
	 * @return {string}
	 */
	read: function(type) {
		var data = this.node.retrieve('tooltip:' + type),
			key = (type === 'title') ? this.customOptions.titleQuery : this.customOptions.contentQuery;

		if (data) {
			return data;

		} else if (typeOf(key) === 'function') {
			return key(this.node);

		} else {
			return this.node.get(key);
		}
	},

	/**
	 * Show the tooltip and determine whether to grab the content from an AJAX call,
	 * a DOM node, or plain text. Can pass an options object to overwrite the defaults.
	 *
	 * @param {object} node
	 * @param {object} options
	 */
	show: function(node, options) {
		if (!node) {
			return;
		}

		// Configuration
		node = new Element(node);
		options = this.customOptions = Titon.mergeOptions(this.options, node.getOptions('tooltip') || options);

		this.node = node;
		this.title = this.read('title');
		this.content = this.read('content');

		// Set mouse events
		this.fireEvent('show');

		if (options.mode !== 'click') {
			this.node
				.removeEvents('mouseleave')
				.addEvent('mouseleave', this.hide.bind(this));
		}

		// Do an AJAX call using content as the URL
		if (options.ajax) {
			var url = this.content || this.node.get('href');

			if (this.cache[url]) {
				this.content = this.cache[url];
				this.position();

			} else {
				new Request({
					url: url,
					method : 'get',
					evalScripts: true,

					onSuccess: function(response) {
						this.cache[url] = response;
						this.content = response;
						this.position();
					}.bind(this),

					onRequest: function() {
						if (this.customOptions.showLoading) {
							this.content = Titon.msg.loading;
							this.position();
						}
					}.bind(this),

					onFailure: function() {
						this.hide();
					}.bind(this)
				}).get();
			}

		// Plain text
		} else {
			// Copy the content found in the referenced ID
			if (this.content.substr(0, 1) === '#') {
				this.content = $(this.content.remove('#')).get('html');
			}

			this.position();
		}
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Tooltip.instances = {};

/**
 * Easily create multiple Tooltip instances.
 *
 * @param {string} query
 * @param {object} options
 */
Titon.Tooltip.factory = function(query, options) {
	if (Titon.Tooltip.instances[query]) {
		return Titon.Tooltip.instances[query];
	}

	var instance = new Titon.Tooltip(query, options);

	Titon.Tooltip.instances[query] = instance;

	return instance;
};

/**
 * Hide all Tooltip instances.
 */
Titon.Tooltip.hide = function() {
	Object.each(Titon.Tooltip.instances, function(tooltip) {
		tooltip.hide();
	});
};