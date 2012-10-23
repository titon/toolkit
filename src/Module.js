/**
 * Titon: The Mootools UI Framework
 *
 * @copyright	Copyright 2006-2012, Titon
 * @license		http://opensource.org/licenses/mit-license.php - Licensed under the MIT License
 * @link		http://github.com/titon
 */

/**
 * Primary class that all sub-classes should extend from.
 * Provides options, event and template support.
 *
 * @version	1.0.0
 * @uses	Titon
 * @uses	Core
 * @uses	More/Element.From
 * @uses	More/Element.Shortcut
 * @uses	More/Hash
 */
Titon.Module = new Class({
	Implements: [Events, Options],

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
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	templateFrom	- (string) ID of an element to use as the template
	 *	parseTemplate	- (boolean) Whether to parse the template during initialization
	 */
	options: {
		template: '',
		templateFrom: '',
		parseTemplate: true
	},

	/**
	 * Initialize options and template.
	 *
	 * @param {Object} options
	 */
	initialize: function(options) {
		this.setOptions(options);

		// Parse the template from a string, or use a target element
		if (this.options.parseTemplate) {
			var element;

			// From an element
			if (this.options.templateFrom) {
				element = $(this.options.templateFrom.remove('#'));
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
				throw new Error('Template failed to parse.');
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
	 * Attempt to read a value from a node element using the query.
	 *
	 * @param {Element} node
	 * @param {String|Function} query
	 * @return {String}
	 */
	getValue: function(node, query) {
		if (typeOf(query) === 'function') {
			return query(node).bind(this);
		}

		return node.get(query);
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
	 * @return {Titon.Module}
	 */
	reset: function() {
		if (this.element) {
			this.element.dispose();
			this.element = null;
		}

		this.node = null;

		return this;
	},

	/**
	 * Return the element when the class is passed as an argument.
	 *
	 * @return {Element}
	 */
	toElement: function() {
		return this.element;
	}

});