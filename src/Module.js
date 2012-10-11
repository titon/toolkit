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
 */
Titon.Module = new Class({
	Implements: [Events, Options],

	/**
	 * The primary DOM element.
	 */
	element: null,

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
	 * @param {object} options
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
				element = this.parseTemplate(this.options.template);
			}

			// Store it in the DOM
			if (element) {
				element.hide().inject(document.body);

				this.element = element;
			} else {
				throw new Error('Template failed to parse.');
			}
		}
	},

	/**
	 * Parse the template string into a set of DOM elements.
	 *
	 * @param {string} template
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

		return null;
	}

});