/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

/**
 * Creates dynamic tooltips that will display at a specific element or the mouse cursor.
 *
 * @uses	Titon
 * @uses	Titon.Module
 * @uses	Core
 * @uses	More/Class.Binds
 * @uses	More/Element.Event.Pseudos
 * @uses	More/Element.Position
 */
Titon.Tooltip = new Class({
	Extends: Titon.Module,
	Binds: ['_follow', '_listen', 'hide'],

	/**
	 * DOM elements.
	 */
	elementHead: null,
	elementBody: null,

	/**
	 * Is the event mode a click?
	 */
	isClick: false,

	/**
	 * Default options.
	 *
	 *	ajax			- (boolean) The tooltip uses the target as an AJAX call
	 *	fade			- (boolean) Will fade the tooltips in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	className		- (string) Class name to append to a tooltip when it is shown
	 *	position		- (string) The position to display the tooltip over the element
	 *	showLoading		- (boolean) Will display the loading text while waiting for AJAX calls
	 *	showTitle		- (boolean) Will display the element title in the tooltip
	 *	getTitle		- (string) Attribute to read the title from
	 *	getContent		- (string) Attribute to read the content from
	 *	mouseThrottle	- (int) The amount in milliseconds to update mouse hover location
	 *	xOffset			- (int) Additional margin on the X axis
	 *	yOffset			- (int) Additional margin on the Y axis
	 *	delay			- (int) The delay in milliseconds before the tooltip shows
	 *	context			- (element) The element the tooltips will display in (defaults body)
	 *	errorMessage	- (string) Error message when AJAX calls fail
	 *	loadingMessage	- (string) Loading message while waiting for AJAX calls
	 *	titleElement	- (string) CSS query for the title element within the template
	 *	contentElement	- (string) CSS query for the content element within the template
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	onHide			- (function) Callback to trigger when a tooltip is hidden
	 *	onShow			- (function) Callback to trigger when a tooltip is shown through event
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
		getTitle: 'title',
		getContent: 'data-tooltip',
		mouseThrottle: 50,
		xOffset: 0,
		yOffset: 0,
		delay: 0,
		context: null,
		errorMessage: Titon.msg.error,
		loadingMessage: Titon.msg.loading,
		titleElement: '.tooltip-head',
		contentElement: '.tooltip-body',
		template: '<div class="tooltip">' +
			'<div class="tooltip-inner">' +
				'<div class="tooltip-head"></div>' +
				'<div class="tooltip-body"></div>' +
			'</div>' +
			'<div class="tooltip-arrow"></div>' +
		'</div>',

		// Events
		onHide: null,
		onShow: null,
		onPosition: null
	},

	/**
	 * Custom options per node.
	 */
	customOptions: {},

	/**
	 * Initialize tooltips.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		this.parent(options);
		this.query = query;

		// Get elements
		this.elementHead = this.element.getElement(this.options.titleElement);
		this.elementBody = this.element.getElement(this.options.contentElement);

		// Set options
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}

		this.isClick = (this.options.mode !== 'hover');

		// Set events
		this.disable().enable();
	},

	/**
	 * Disable tooltip events.
	 *
	 * @return {Titon.Tooltip}
	 */
	disable: function() {
		if (this.query) {
			$(this.options.context || document.body).removeEvent((this.isClick ? 'click' : 'mouseenter') + ':relay(' + this.query + ')', this._listen);
		}

		return this;
	},

	/**
	 * Enable tooltip events.
	 *
	 * @return {Titon.Tooltip}
	 */
	enable: function() {
		if (this.query) {
			$(this.options.context || document.body).addEvent((this.isClick ? 'click' : 'mouseenter') + ':relay(' + this.query + ')', this._listen);
		}

		return this;
	},

	/**
	 * Hide the tooltip and set all relevant values to null.
	 */
	hide: function() {
		if (!this.isVisible()) {
			return;
		}

		if (this.options.fade) {
			this.element.fadeOut(this.options.fadeDuration, function() {
				// Must set to hidden or else it won't show again
				this.element.hide();
			}.bind(this));

		} else {
			this.element.hide();
		}

		if (this.customOptions.className !== this.options.className) {
			this.element.removeClass(this.customOptions.className);
		}

		if (this.customOptions.position) {
			this.element.removeClass(this.customOptions.position.hyphenate());
		}

		this.customOptions = {};

		this.fireEvent('hide');

		this.node.removeEvents('mousemove');
		this.node = null;
	},

	/**
	 * Show the tooltip and determine whether to grab the content from an AJAX call,
	 * a DOM node, or plain text. Can pass an options object to overwrite the defaults.
	 *
	 * @param {Element} node
	 * @param {String|Element} content
	 * @param {Object|boolean} options
	 * @param {String|Element} title
	 */
	show: function(node, content, options, title) {
		if (options === true) {
			options = { ajax: true };
		} else if (!options) {
			options = { ajax: this.options.ajax };
		}

		options = Titon.mergeOptions(this.options, options);

		// Get content
		if (node) {
			options = Titon.mergeOptions(options, node.getOptions('tooltip'));

			// Set mouse events
			if (!this.isClick) {
				node
					.removeEvent('mouseleave', this.hide)
					.addEvent('mouseleave', this.hide);
			}

			title = title || this.getValue(node, options.getTitle);
			content = content || this.getValue(node, options.getContent);
		}

		if (!content) {
			return;
		}

		this.node = node;
		this.customOptions = options;

		// Add custom classes
		this.element
			.addClass(options.position.hyphenate())
			.addClass(options.className);

		// AJAX
		if (options.ajax) {
			if (this.cache[content]) {
				this._position(this.cache[content], title);

			} else {
				new Request({
					url: content,
					method: 'get',
					evalScripts: true,
					onSuccess: function(response) {
						this.cache[content] = response;

						if (options.showLoading) {
							if (this.isVisible()) {
								this._position(response);
							}
						} else {
							this._position(response);
						}
					}.bind(this),
					onRequest: function() {
						this.cache[content] = true;

						if (options.showLoading) {
							this._position(new Element('div.tooltip-loading', {
								text: this.options.loadingMessage
							}));
						}
					}.bind(this),
					onFailure: function() {
						delete this.cache[content];

						this._position(new Element('div.tooltip-error', {
							text: this.options.errorMessage
						}));
					}.bind(this)
				}).get();
			}

		// Element, String
		} else {
			this._position(content, title);
		}

		this.fireEvent('show');
	},

	/**
	 * Callback to position the tooltip at the mouse cursor.
	 *
	 * @private
	 * @param {Event} e
	 */
	_follow: function(e) {
		e.stop();

		this.element.setPosition({
			x: (e.page.x + 10 + this.options.xOffset),
			y: (e.page.y + 10 + this.options.yOffset)
		}).fade('show').show();
	},

	/**
	 * Event callback for tooltip element mouseover or click.
	 *
	 * @private
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
	 * Positions the tooltip relative to the current node or the mouse cursor.
	 * Additionally will apply the title/text and hide/show if necessary.
	 *
	 * @private
	 * @param {String|Element} content
	 * @param {String|Element} title
	 */
	_position: function(content, title) {
		if (content === true) {
			return;
		}

		var options = this.customOptions;

		// Set title
		if (title && options.showTitle) {
			this.elementHead.setHtml(title).show();
		} else {
			this.elementHead.hide();
		}

		// Set body
		if (content) {
			this.elementBody.setHtml(content).show();
		} else {
			this.elementBody.hide();
		}

		// Follow the mouse
		if (options.position === 'mouse') {
			var event = 'mousemove:throttle(' + this.options.mouseThrottle + ')';

			this.node
				.removeEvent(event, this._follow)
				.addEvent(event, this._follow);

			this.fireEvent('position');

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

			this.element.position({
				relativeTo: this.node,
				position: position,
				edge: edgeMap[position] || 'topLeft',
				offset: {
					x: -options.xOffset,
					y: -options.yOffset
				}
			});

			window.setTimeout(function() {
				if (!this.isVisible()) {
					if (this.options.fade) {
						this.element.fadeIn(this.options.fadeDuration);
					} else {
						this.element.show();
					}
				}

				this.fireEvent('position');
			}.bind(this), this.options.delay || 0);
		}
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Tooltip.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} options
 * @return {Titon.Tooltip}
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
 * Hide all instances.
 */
Titon.Tooltip.hide = function() {
	Object.each(Titon.Tooltip.instances, function(tooltip) {
		tooltip.hide();
	});
};