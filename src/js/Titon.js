/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(window) {
	'use strict';

window.Titon = {

	/** Current version. */
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
	},

	/**
	 * If the value is an object, merge it.
	 * Otherwise set a default key on the object.
	 *
	 * @param {Type} value
	 * @param {String} defaultKey
	 * @returns {Object}
	 */
	parseOptions: function(value, defaultKey) {
		var options = {};

		if (typeOf(value) === 'object') {
			Object.merge(options, value);
		} else if (value) {
			options[defaultKey] = value;
		}

		return options;
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

	show: function(callback) {
		if (this.hasClass('fade')) {
			this.setStyle('opacity', 1);

		} else if (this.hasClass('slide')) {
			this.setStyle('height', this.measure(function() {
				return this.setStyle('height', 'auto').getHeight();
			}));

		} else {
			this.setStyle('display', '');
		}

		if (typeOf(callback) === 'function') {
			callback();
		}

		return this;
	},

	hide: function(callback) {
		if (this.hasClass('fade')) {
			this.setStyle('opacity', 0);

		} else if (this.hasClass('slide')) {
			this.setStyle('height', 0);

		} else {
			this.setStyle('display', 'none');
		}

		if (typeOf(callback) === 'function') {
			callback();
		}

		return this;
	},

	/**
	 * Return true if the element exists and is visible.
	 *
	 * @return {bool}
	 */
	isVisible: function() {
		if (this.hasClass('fade')) {
			return (this.getStyle('opacity') > 0);

		} else if (this.hasClass('slide')) {
			return (this.getStyle('height').toInt() > 0);
		}

		return (this.getStyle('display') !== 'none');
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