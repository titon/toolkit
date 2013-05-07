/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(window) {
	'use strict';

window.Titon = {

	/**
	 * Current version.
	 */
	version: '1.0.0',

	/**
	 * Options for all classes.
	 *
	 *	prefix			- (string) String to prepend to all created element containers
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
		draggingClass: 'dragging',
		loadingClass: 'loading',
		failedClass: 'failed'
	},

	/**
	 * Apply custom options.
	 *
	 * @param {Object} options
	 */
	setup: function(options) {
		Titon.options = Object.merge(Titon.options, options);
	}

};

/**
 * Localization messages.
 */
Locale.define('en-US', 'Titon', {
	loading: 'Loading...',
	error: 'An error has occurred!'
});

/**
 * Prototype overrides.
 */
Element.implement({

	/**
	 * Fade in an element and trigger callback.
	 *
	 * @param {Object|int} options
	 * @param {Function} callback
	 * @return {Element}
	 */
	fadeIn: function(options, callback) {
		if (typeOf(options) === 'number') {
			options.duration = options;
		}

		this.setStyles({ display: '', opacity: 0 }).set('tween', options).fade('in');
		this.get('tween').chain(callback);

		return this;
	},

	/**
	 * Fade out an element and trigger callback.
	 *
	 * @param {Object|int} options
	 * @param {Function} callback
	 * @return {Element}
	 */
	fadeOut: function(options, callback) {
		if (typeOf(options) === 'number') {
			options.duration = options;
		}

		this.set('tween', options).fade('out');
		this.get('tween').chain(callback, function() {
			this.hide(); // Hide the element so isVisible() returns correctly
		}.bind(this));

		return this;
	},

	/**
	 * Set the content of the element.
	 *
	 * @param {String|Element} html
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
	},

	/**
	 * Slide in an element and trigger callback.
	 *
	 * @param {Object|int} options
	 * @param {Function} callback
	 * @return {Element}
	 */
	slideIn: function(options, callback) {
		if (typeOf(options) === 'number') {
			options.duration = options;
		}

		this.set('slide', options).slide('in');
		this.get('slide').chain(callback);

		return this;
	},

	/**
	 * Slide out an element and trigger callback.
	 *
	 * @param {Object|int} options
	 * @param {Function} callback
	 * @return {Element}
	 */
	slideOut: function(options, callback) {
		if (typeOf(options) === 'number') {
			options.duration = options;
		}

		this.set('slide', options).slide('out');
		this.get('slide').chain(callback);

		return this;
	}

});

String.implement({

	/**
	 * Remove specific characters from a string.
	 *
	 * @param {String|Array} chars
	 * @return {String}
	 */
	remove: function(chars) {
		if (typeOf(chars) !== 'array') {
			chars = chars.toString().split('');
		}

		return this.replace(new RegExp('[' + chars.join('|') + ']+', 'ig'), '');
	}

});

Array.implement({

	/**
	 * Split an array into multiple chunked arrays.
	 *
	 * @param {int} size
	 * @return {Array}
	 */
	chunk: function(size) {
		var array = this;

		return [].concat.apply([], array.map(function(elem, i) {
			return (i % size) ? [] : [ array.slice(i, i + size) ];
		}));
	}

});

})(window);