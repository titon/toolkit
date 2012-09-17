/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Primary class that all sub-classes should extend from.
 * Provides options, event and template support.
 *
 * @version	0.1
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
	 */
	options: {
		template: '',
		templateFrom: ''
	},

	/**
	 * Initialize options and template.
	 *
	 * @param {object} options
	 */
	initialize: function(options) {
		this.setOptions(options);

		// Parse the template from a string, or use a target element
		var template = this.options.template || '';

		if (this.options.templateFrom) {
			var element = $(this.options.templateFrom);

			if (element) {
				template = element;
			}
		}

		this.parseTemplate(template);
	},

	/**
	 * Parse the template string into a set of DOM elements.
	 *
	 * @param {string} template
	 * @return {Titon.Module}
	 */
	parseTemplate: function(template) {
		if (!template) {
			return this;
		}

		// If template is an element, use it
		if (typeOf(template) === 'element') {
			this.element = template;

			return this;
		}

		var element = Element.from(template);

		// Element.from() returns an array, so grab the first node
		if (element[0]) {
			element = element[0];
			element.hide().inject(document.body);

			// Apply prefix to base class
			if (Titon.options.prefix) {
				element.set('class', Titon.options.prefix + element.get('class'));
			}

			this.element = element;
		}

		return this;
	}

});