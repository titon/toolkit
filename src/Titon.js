/**
 * Titon: The Mootools UI Framework
 *
 * @copyright	Copyright 2006-2012, Titon
 * @license		http://opensource.org/licenses/mit-license.php - Licensed under the MIT License
 * @link		http://github.com/titon
 */

/**
 * The base object for all Titon classes. Contains global functionality and configuration.
 *
 * @version	1.0.0
 */
var Titon = {

	/**
	 * Current version.
	 */
	version: '1.0.0-beta',

	/**
	 * Options for all classes.
	 *
	 *	prefix 			- (string) String to prepend to all created element containers
	 *	activeClass		- (string) Class name to append to active elements
	 *	disabledClass	- (string) Class name to append to disabled elements
	 *	draggableClass	- (string) Class name to append to elements that are draggable
	 *	draggingClass	- (string) Class name to append to elements being dragged
	 */
	options: {
		prefix: '',
		activeClass: 'active',
		disabledClass: 'disabled',
		draggableClass: 'draggable',
		draggingClass: 'dragging'
	},

	/**
	 * Localization messages.
	 */
	msg: {
		loading: 'Loading...',
		error: 'An error has occurred!'
	},

	/**
	 * Converts a value to a specific scalar type.
	 * The value is extracted via parseOptions().
	 *
	 * @param {string} value
	 * @return {boolean|string|number}
	 */
	convertType: function(value) {
		value = value.trim();

		if (value === 'true') {
			value = true;

		} else if (value === 'false') {
			value = false;

		} else if (value === 'null') {
			value = null;

		} else if (isNaN(value)) {
			value = String.from(value);

		} else {
			value = Number.from(value);
		}

		return value;
	},

	/**
	 * Merge custom options into the base. Clone the base as to not reference the original.
	 *
	 * @param {object} base
	 * @param {object} options
	 * @return {object}
	 */
	mergeOptions: function(base, options) {
		return Object.merge(Object.clone(base || {}), options || {});
	},

	/**
	 * Parse options out of the data-options attributes.
	 * Format: key1:value1;key2:value2
	 *
	 * @param {object} data
	 * @return {object}
	 */
	parseOptions: function(data) {
		var options = {};

		if (data) {
			data.split(';').each(function(item) {
				var pieces = item.split(':');

				if (pieces.length) {
					options[pieces[0]] = Titon.convertType(pieces[1]);
				}
			});
		}

		return options;
	},

	/**
	 * Apply custom options.
	 *
	 * @param {object} options
	 */
	setup: function(options) {
		Titon.options = Object.merge(Titon.options, options);
	}

};

/**
 * Prototype overrides.
 */
Element.implement({

	/**
	 * Returns an object representation of the data-options attribute located on the element.
	 *
	 * @param {string} scope
	 * @return {object}
	 */
	getOptions: function(scope) {
		return Titon.parseOptions(this.get('data-' + scope + '-options'));
	},

	/**
	 * Fade in an element and set its display type.
	 *
	 * @param {int} duration
	 * @return {Element}
	 */
	fadeIn: function(duration) {
		duration = duration || 600;

		return this.setStyles({
			display: '',
			opacity: 0
		}).set('tween', {
			duration: duration,
			link: 'cancel'
		}).fade('in');
	},

	/**
	 * Fade out an element and remove from DOM.
	 *
	 * @param {int} duration
	 * @param {function} callback
	 * @return {Element}
	 */
	fadeOut: function(duration, callback) {
		duration = duration || 600;

		if (typeOf(callback) === 'null') {
			callback = function() {
				this.element.dispose();
			};
		}

		this.set('tween', {
			duration: duration,
			link: 'cancel'
		}).fade('out');

		if (callback) {
			this.get('tween').chain(callback);
		}

		return this;
	},

	/**
	 * Set the content of the element.
	 *
	 * @param {string|Element} html
	 * @return {Element}
	 */
	setHtml: function(html) {
		if (typeOf(html) === 'element') {
			this.empty().grab(html);

		} else if (typeOf(html) === 'string' && html.substr(0, 1) === '#') {
			this.set('html', document.getElement(html).get('html'));

		} else {
			this.set('html', html);
		}

		return this;
	}

});

String.implement({

	/**
	 * Remove specific characters from a string.
	 *
	 * @param {string|array} chars
	 * @return {String}
	 */
	remove: function(chars) {
		if (typeOf(chars) !== 'array') {
			chars = chars.toString().split('');
		}

		return this.replace(new RegExp('[' + chars.join('|') + ']+', 'ig'), '');
	}

});