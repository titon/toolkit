/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Component = new Class({
	Implements: [Events, Options],
	Binds: ['_show', '_hide', '_position'],

	/** Cached data. */
	cache: {},

	/** The primary DOM element or elements. */
	element: null,
	elements: [],

	/** Current node that activated the module. */
	node: null,

	/** Query selector used for module activation. */
	query: null,

	/**
	 * Default options.
	 *
	 *	className		- (string) Class name to append to primary element
	 *	context			- (element) The element the module will display in (defaults to document.body)
	 *	fade			- (int) Will fade the element in and out in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	errorMessage	- (string) Error message when AJAX calls fail
	 *	loadingMessage	- (string) Loading message while waiting for AJAX calls
	 *	multiElement	- (bool) Whether the module holds a single element or multiple
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	templateFrom	- (string) ID of an element to use as the template
	 *	parseTemplate	- (bool) Whether to parse the template during initialization
	 *	onInit			- (function) Callback to trigger when class is instantiated
	 *	onHide			- (function) Callback to trigger when the element is hidden
	 *	onShow			- (function) Callback to trigger when the element is shown
	 */
	options: {
		className: '',
		context: null,
		fade: false,
		mode: 'click',

		// Ajax
		errorMessage: null,
		loadingMessage: null,

		// Elements
		multiElement: false,

		// Templates
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
	 * @param {String|Element|Elements} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		this.setOptions(options || {});

		options = this.options;

		// Allow element to be targeted
		if (typeOf(query) === 'element') {
			this.element = query;
			this.query = this.element.get('id');
			options.parseTemplate = false;

		} else if (typeOf(query) === 'elements') {
			this.elements = query;
			this.query = this.elements.get('class');
			options.multiElement = true;

		} else {
			this.query = query;
		}

		// No templates for multiple elements
		if (options.multiElement) {
			options.parseTemplate = false;
		}

		// Parse the template from a string, or use a target element
		if (options.parseTemplate && !this.element) {
			var element;

			if (typeOf(options.templateFrom) === 'element') {
				element = options.templateFrom;
			} else {
				element = $(options.templateFrom.remove('#'));
			}

			// From a string
			if (!element && options.template) {
				element = this.parseTemplate(options.template);

				if (element) {
					element.hide(true).inject(document.body);
				}
			}

			// Store it in the DOM
			if (element) {
				this.element = element;
			}
		}

		// Add a class name
		if (options.className) {
			if (this.element) {
				this.element.addClass(options.className);

			} else if (this.elements) {
				this.elements.addClass(options.className);
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
	 * @return {Titon.Component}
	 */
	disable: function() {
		return this._toggleEvents(false);
	},

	/**
	 * Enable activation events.
	 *
	 * @return {Titon.Component}
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
	 *
	 * @param {Function} [callback]
	 */
	hide: function(callback) {
		if (this.isVisible()) {
			this.element.hide(null, callback);
			this.fireEvent('hide');
		}
	},

	/**
	 * Return true if the element is visible.
	 *
	 * @return {bool}
	 */
	isVisible: function() {
		return (this.element && this.element.isVisible());
	},

	/**
	 * Parse the template string into a set of DOM elements.
	 *
	 * @param {String|Element} template
	 * @return {Element}
	 */
	parseTemplate: function(template) {
		if (!template) {
			return null;
		}

		// If template is an element, use it
		if (typeOf(template) === 'element') {
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

		throw new Error(this.className() + ' template failed to parse');
	},

	/**
	 * Request data from a URL and handle all the possible scenarios.
	 *
	 * @param {String} url
	 */
	requestData: function(url) {
		if (this.cache[url]) {
			return;
		}

		new Request({
			url: url,
			method: 'get',
			evalScripts: true,

			onSuccess: function(response) {
				this.cache[url] = response;

				// Does not apply to all modules
				if (this.options.showLoading) {
					this.element.removeClass(Titon.options.loadingClass);
				}

				this._position(response);
			}.bind(this),

			onRequest: function() {
				this.cache[url] = true;

				// Does not apply to all modules
				if (this.options.showLoading) {
					this.element.addClass(Titon.options.loadingClass);

					this._position(this._loadingTemplate());

					// Decrease count since _position() is being called twice
					if (this.options.blackout) {
						this.blackout.decrease();
					}
				}
			}.bind(this),

			onFailure: function() {
				delete this.cache[url];

				this.element
					.removeClass(Titon.options.loadingClass)
					.addClass(Titon.options.failedClass);

				this._position(this._errorTemplate());
			}.bind(this)
		}).get();
	},

	/**
	 * Destroy the current template and reset.
	 *
	 * @param {bool} [dispose]
	 * @return {Titon.Component}
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

		this.element.show();
		this.fireEvent('show');
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
	 * Return a DOM element for error messages.
	 *
	 * @private
	 * @returns {Element}
	 */
	_errorTemplate: function() {
		return new Element('div.' + this.className().toLowerCase() + '-error', {
			text: this.options.errorMessage || Locale.get('Titon.error')
		});
	}.protect(),

	/**
	 * Event callback to hide an element.
	 *
	 * @private
	 * @param {Event} e
	 */
	_hide: function(e) {
		if (typeOf(e) === 'domevent') {
			e.stop();
		}

		this.hide();
	},

	/**
	 * Return a DOM element for loading messages.
	 *
	 * @private
	 * @returns {Element}
	 */
	_loadingTemplate: function() {
		return new Element('div.' + this.className().toLowerCase() + '-loading', {
			text: this.options.loadingMessage || Locale.get('Titon.loading')
		});
	}.protect(),

	/**
	 * Set the content and position the element.
	 *
	 * @private
	 * @param {String} content
	 */
	_position: function(content) {
		this.element.set('html', content);
	},

	/**
	 * Event callback to show an element via node hover or click.
	 *
	 * @private
	 * @param {Event} e
	 * @param {Element} node
	 */
	_show: function(e, node) {
		if (typeOf(e) === 'domevent') {
			e.stop();
		}

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
	 * @return {Titon.Component}
	 */
	_toggleEvents: function(on) {
		if (!this.query) {
			return this;
		}

		var options = this.options,
			event = (this.options.mode === 'click' ? 'click' : 'mouseenter') + ':relay(' + this.query + ')',
			context = $(options.context || document.body);

		if (on) {
			context.addEvent(event, this._show);
		} else {
			context.removeEvent(event, this._show);
		}

		return this;
	}.protect()

});

})();