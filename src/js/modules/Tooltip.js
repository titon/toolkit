/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

/**
 * Creates dynamic tooltips that will display at a specific element or the mouse cursor.
 */
Titon.Tooltip = new Class({
	Extends: Titon.Module,
	Binds: ['_follow'],

	/**
	 * DOM elements.
	 */
	elementHead: null,
	elementBody: null,

	/**
	 * Default options.
	 *
	 *	ajax			- (boolean) The tooltip uses the target as an AJAX call
	 *	position		- (string) The position to display the tooltip over the element
	 *	showLoading		- (boolean) Will display the loading text while waiting for AJAX calls
	 *	showTitle		- (boolean) Will display the element title in the tooltip
	 *	getTitle		- (string) Attribute to read the title from
	 *	getContent		- (string) Attribute to read the content from
	 *	mouseThrottle	- (int) The amount in milliseconds to update mouse hover location
	 *	xOffset			- (int) Additional margin on the X axis
	 *	yOffset			- (int) Additional margin on the Y axis
	 *	delay			- (int) The delay in milliseconds before the tooltip shows
	 *	titleElement	- (string) CSS query for the title element within the template
	 *	contentElement	- (string) CSS query for the content element within the template
	 */
	options: {
		mode: 'hover',
		ajax: false,
		position: 'topRight',
		showLoading: true,
		showTitle: true,
		getTitle: 'title',
		getContent: 'data-tooltip',
		mouseThrottle: 50,
		xOffset: 0,
		yOffset: 0,
		delay: 0,
		titleElement: '.tooltip-head',
		contentElement: '.tooltip-body',
		template: '<div class="tooltip">' +
			'<div class="tooltip-inner">' +
				'<div class="tooltip-head"></div>' +
				'<div class="tooltip-body"></div>' +
			'</div>' +
			'<div class="tooltip-arrow"></div>' +
		'</div>'
	},

	/**
	 * Initialize tooltips.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		this.parent(query, options);

		// Fetch elements
		this.elementHead = this.element.getElement(this.options.titleElement);
		this.elementBody = this.element.getElement(this.options.contentElement);

		// Add position class
		this.element.addClass(this.options.position.hyphenate());

		// Set events
		this.disable().enable();

		this.fireEvent('init');
	},

	/**
	 * Show the tooltip and determine whether to grab the content from an AJAX call,
	 * a DOM node, or plain text. The content and title can also be passed as arguments.
	 *
	 * @param {Element} node
	 * @param {String|Element} content
	 * @param {String|Element} title
	 */
	show: function(node, content, title) {
		if (node) {
			if (this.options.mode === 'hover') {
				node
					.removeEvent('mouseleave', this._hide)
					.addEvent('mouseleave', this._hide);
			}

			title = title || this.getValue(node, this.options.getTitle);
			content = content || this.getValue(node, this.options.getContent);
		}

		if (!content) {
			return;
		}

		this.node = node;

		if (this.options.ajax) {
			if (this.cache[content]) {
				this._position(this.cache[content], title);
			} else {
				this.requestData(content);
			}
		} else {
			this._position(content, title);
		}
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
	 * Positions the tooltip relative to the current node or the mouse cursor.
	 * Additionally will apply the title/content and hide/show if necessary.
	 *
	 * @private
	 * @param {String|Element} content
	 * @param {String|Element} title
	 */
	_position: function(content, title) {
		// AJAX is currently loading
		if (content === true) {
			return;
		}

		// Set title
		if (title && this.options.showTitle) {
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
		if (this.options.position === 'mouse') {
			var event = 'mousemove:throttle(' + this.options.mouseThrottle + ')';

			this.node
				.removeEvent(event, this._follow)
				.addEvent(event, this._follow);

			this.fireEvent('show');

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
			}).hide();

			window.setTimeout(function() {
				if (!this.isVisible()) {
					if (this.options.fade) {
						this.element.fadeIn(this.options.fadeDuration);
					} else {
						this.element.show();
					}
				}

				this.fireEvent('show');
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

})();