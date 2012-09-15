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
 * @version	0.16
 * @uses	Titon
 * @uses	Core
 * @uses	More/Element.Position
 */
Titon.Tooltip = new Class({
	Implements: [Events, Options],

	/**
	 * A cache of all AJAX calls, indexed by the URL.
	 */
	cache: {},

	/**
	 * DOM elements.
	 */
	element: null,
	elementHead: null,
	elementBody: null,

	/**
	 * Is the tooltip currently visible?
	 */
	isVisible: false,

	/**
	 * Current node that activated the tooltip.
	 */
	node: null,

	/**
	 * Query selector used for tooltip activation.
	 */
	query: null,

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
			outer = new Element('div.' + Titon.options.prefix + 'tooltip'),
			inner = new Element('div.tooltip-inner'),
			head = new Element('div.tooltip-head'),
			body = new Element('div.tooltip-body'),
			listenCallback = this.listen.bind(this);

		inner.grab(head).grab(body);
		outer.grab(inner).inject(document.body).hide();

		this.element = outer;
		this.elementHead = head;
		this.elementBody = body;

		// Set options
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}

		// Set events
		$(this.options.context || document.body)
			.removeEvent(event + ':relay(' + query + ')', listenCallback)
			.addEvent(event + ':relay(' + query + ')', listenCallback);
	},

	/**
	 * Callback to position the tooltip at the mouse cursor.
	 *
	 * @param {event} e
	 */
	follow: function(e) {
		e.stop();

		this.element.setPosition({
			x: (e.page.x + 10 + this.options.xOffset),
			y: (e.page.y + 10 + this.options.yOffset)
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

		if (this.options.fade) {
			this.element.fadeOut(this.options.fadeDuration, false);
		} else {
			this.element.hide();
		}

		this.fireEvent('hide');
	},

	/**
	 * Event callback for tooltip element mouseover or click.
	 *
	 * @param {event} e
	 * @param {Element} node
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
	 * Show the tooltip and determine whether to grab the content from an AJAX call,
	 * a DOM node, or plain text. Can pass an options object to overwrite the defaults.
	 *
	 * @param {Element} node
	 * @param {object} options
	 */
	show: function(node, options) {
		node = new Element(node);
		options = Titon.mergeOptions(this.options, node.getOptions('tooltip') || options);

		this.node = node;

		var title = this._read('title'),
			content = this._read('content');

		if (title && options.showTitle) {
			this.elementHead.set('html', title).show();
		} else {
			this.elementHead.hide();
		}

		// Set mouse events
		this.fireEvent('show');

		if (options.mode !== 'click') {
			this.node
				.removeEvents('mouseleave')
				.addEvent('mouseleave', this.hide.bind(this));
		}

		// AJAX call
		if (options.ajax) {
			var url = content || this.node.get('href');

			if (this.cache[url]) {
				this._position(this.cache[url]);

			} else {
				new Request({
					url: url,
					method: 'get',
					evalScripts: true,

					onSuccess: function(response) {
						this.cache[url] = response;
						this._position(response);
					}.bind(this),

					onRequest: function() {
						if (this.options.showLoading) {
							this._position(Titon.msg.loading);
						}
					}.bind(this),

					onFailure: function() {
						this.hide();
					}.bind(this)
				}).get();
			}

		// DOM element
		} else if (content.substr(0, 1) === '#') {
			this._position($(content.remove('#')).get('html'));

		// Text
		} else {
			this._position(content);
		}
	},

	/**
	 * Positions the tooltip relative to the current node or the mouse cursor.
	 * Additionally will apply the title/text and hide/show if necessary.
	 *
	 * @param {string|Element} content
	 */
	_position: function(content) {
		if (content) {
			this.elementBody.set('html', content).show();
		} else {
			this.elementBody.hide();
		}

		this.isVisible = true;

		// Follow the mouse
		if (this.options.position === 'mouse') {
			this.node
				.removeEvents('mousemove')
				.addEvent('mousemove', this.follow.bind(this));

			this.fireEvent('position');

			// Position accordingly
		} else {
			var position = this.options.position,
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

			this.element.position({
				relativeTo: this.node,
				position: position,
				edge: edgeMap[position] || 'topLeft',
				offset: {
					x: -this.options.xOffset,
					y: -this.options.yOffset
				}
			});

			window.setTimeout(function() {
				if (this.options.fade) {
					this.element.fadeIn(this.options.fadeDuration);
				} else {
					this.element.show();
				}

				this.fireEvent('position');
			}.bind(this), this.options.delay || 0);
		}
	}.protect(),

	/**
	 * Attempt to read a value from multiple locations.
	 * DOM storage will always take precedent.
	 *
	 * @param {string} type
	 * @return {string}
	 */
	_read: function(type) {
		var data = this.node.retrieve('tooltip:' + type, null),
			key = (type === 'title') ? this.options.titleQuery : this.options.contentQuery;

		if (data) {
			return data;

		} else if (typeOf(key) === 'function') {
			return key(this.node);

		} else {
			return this.node.get(key);
		}
	}.protect()

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