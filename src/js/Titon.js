/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(window) {
	'use strict';

/**
 * The base object for all Titon classes. Contains global functionality and configuration.
 */
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
	 * Fade in an element and set its display type.
	 *
	 * @param {int} duration
	 * @param {Function} callback
	 * @return {Element}
	 */
	fadeIn: function(duration, callback) {
		this.setStyles({
			display: '',
			opacity: 0
		}).set('tween', {
			duration: duration || 600,
			link: 'cancel'
		}).fade('in');

		this.get('tween').chain(callback);

		return this;
	},

	/**
	 * Fade out an element and trigger callback.
	 *
	 * @param {int} duration
	 * @param {Function} callback
	 * @return {Element}
	 */
	fadeOut: function(duration, callback) {
		this.set('tween', {
			duration: duration || 600,
			link: 'cancel'
		}).fade('out');

		this.get('tween').chain(callback, function() {
			// Hide the element so isVisible() returns correctly
			this.hide();
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