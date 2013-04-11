/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

"use strict";

/**
 * Primary class that all sub-classes should extend from.
 * Provides options, event and template support.
 */
Titon.Module = new Class({
	Implements: [Events, Options],
	Binds: ['_listen', 'hide', 'show'],

	/**
	 * Cached data.
	 */
	cache: {},

	/**
	 * The primary DOM element.
	 */
	element: null,

	/**
	 * Current node that activated the module.
	 */
	node: null,

	/**
	 * Query selector used for module activation.
	 */
	query: null,

	/**
	 * Default options.
	 *
	 *	className		- (string) Class name to append to a menu when it is shown
	 *	context			- (element) The element the module will display in (defaults to document.body)
	 *	fade			- (boolean) Will fade the menus in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	templateFrom	- (string) ID of an element to use as the template
	 *	parseTemplate	- (boolean) Whether to parse the template during initialization
	 *	onInit			- (function) Callback to trigger when class is instantiated
	 *	onHide			- (function) Callback to trigger when the element is hidden
	 *	onShow			- (function) Callback to trigger when the element is shown
	 */
	options: {
		className: '',
		context: null,
		fade: false,
		fadeDuration: 250,
		mode: 'click',
		template: '',
		templateFrom: '',
		parseTemplate: true,

		// Events
		onInit: null,
		onHide: null,
		onShow: null
	},

	/**
	 * Initialize options and template.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		this.query = query;
		this.setOptions(options || {});

		// Parse the template from a string, or use a target element
		if (this.options.parseTemplate) {
			var element;

			// From an element
			if (this.options.templateFrom) {
				element = document.id(this.options.templateFrom);
			}

			// From a string
			if (!element && this.options.template) {
				if (element = this.parseTemplate(this.options.template)) {
					element.hide().inject(document.body);
				}
			}

			// Store it in the DOM
			if (element) {
				this.element = element;
			} else {
				throw new Error('Template failed to parse');
			}

			// Add a class name
			if (this.options.className) {
				this.element.addClass(this.options.className);
			}
		}
	},

	/**
	 * Return the class name of the current object.
	 *
	 * @return {String}
	 */
	className: function() {
		return new Hash(window.Titon).keyOf(this.$constructor);
	},

	/**
	 * Disable activation events.
	 *
	 * @return {Titon.Module}
	 */
	disable: function() {
		return this._toggleEvents(false);
	},

	/**
	 * Enable activation events.
	 *
	 * @return {Titon.Module}
	 */
	enable: function() {
		return this._toggleEvents(true);
	},

	/**
	 * Attempt to read a value from a node element using the query.
	 *
	 * @param {Element} node
	 * @param {String|Function} query
	 * @return {String}
	 */
	getValue: function(node, query) {
		if (!query) {
			return null;
		}

		if (typeOf(query) === 'function') {
			return query(node, this);
		}

		return node.get(query);
	},

	/**
	 * Hide the element and set all relevant values to null.
	 */
	hide: function() {
		if (this.isVisible()) {
			if (this.options.fade) {
				this.element.fadeOut(this.options.fadeDuration);
			} else {
				this.element.hide();
			}
		}

		this.fireEvent('hide');
	},

	/**
	 * Return true if the element exists and is visible.
	 *
	 * @return {boolean}
	 */
	isVisible: function() {
		return (this.element && this.element.isVisible());
	},

	/**
	 * Parse the template string into a set of DOM elements.
	 *
	 * @param {String} template
	 * @return {Element}
	 */
	parseTemplate: function(template) {
		if (!template) {
			return null;
		}

		// If template is an element, use it
		if (typeOf(template) === 'element' || instanceOf(template, Element)) {
			return template;
		}

		// Elements.from() returns an array, so grab the first node
		var element = Elements.from(template);

		if (element[0]) {
			element = element[0];

			// Apply prefix to base class
			if (Titon.options.prefix) {
				element.set('class', Titon.options.prefix + element.get('class'));
			}

			return element;
		}

		return null;
	},

	/**
	 * Destroy the current template and reset.
	 *
	 * @param {boolean} dispose
	 * @return {Titon.Module}
	 */
	reset: function(dispose) {
		if (this.element && dispose) {
			this.element.dispose();
			this.element = null;
		}

		this.cache = {};
		this.node = null;

		return this;
	},

	/**
	 * Show the element and store the node.
	 *
	 * @param {Element} node
	 */
	show: function(node) {
		this.node = node;

		if (this.options.fade) {
			this.element.fadeIn(this.options.fadeDuration);
		} else {
			this.element.show();
		}

		this.fireEvent('show')
	},

	/**
	 * Return the element when the class is passed as an argument.
	 *
	 * @return {Element}
	 */
	toElement: function() {
		return this.element;
	},

	/**
	 * Event callback for node mouseover or click.
	 *
	 * @private
	 * @param {Event} e
	 * @param {Element} node
	 */
	_listen: function(e, node) {
		e.stop();

		if (this.isVisible()) {
			if (this.options.mode === 'click') {
				this.hide();
			}

			// Exit if the same node
			if (node === this.node) {
				return;
			}
		}

		this.show(node);
	},

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.Module}
	 */
	_toggleEvents: function(on) {
		if (!this.query) {
			return this;
		}

		var options = this.options,
			event = (this.options.mode === 'click' ? 'click' : 'mouseenter') + ':relay(' + this.query + ')',
			context = $(options.context || document.body);

		if (on) {
			context.addEvent(event, this._listen);
		} else {
			context.removeEvent(event, this._listen);
		}

		return this;
	}.protect()

});