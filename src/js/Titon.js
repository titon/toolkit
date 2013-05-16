/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(window) {
	'use strict';

window.Titon = {

	/** Current version. */
	version: '0.0.0',

	/**
	 * Options for all classes.
	 *
	 *	prefix			- (string) String to prepend to all created element containers
	 *	activeClass		- (string) Class name to append to active elements
	 *	disabledClass	- (string) Class name to append to disabled elements
	 *	openClass		- (string) Class name to append to elements that have menus open
	 *	draggableClass	- (string) Class name to append to elements that are draggable
	 *	draggingClass	- (string) Class name to append to elements being dragged
	 *	loadingClass	- (string) Class name to append to elements being loaded by AJAX
	 *	failedClass		- (string) Class name used when AJAX calls fail
	 */
	options: {
		prefix: '',
		activeClass: 'is-active',
		disabledClass: 'is-disabled',
		openClass: 'is-open',
		draggableClass: 'is-draggable',
		draggingClass: 'is-dragging',
		loadingClass: 'is-loading',
		failedClass: 'has-failed'
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

	/**
	 * Show the element either through fading, sliding, or direct display.
	 *
	 * @param {String|bool} [type]
	 * @param {Function} [callback]
	 * @returns {Element}
	 */
	show: function(type, callback) {
		if (type === true) {
			this.setStyle('display', '');

		// Fade in the element using CSS3 opacity transition
		// Force the elements display and opacity before animating
		} else if (type === 'fade' || this.hasClass('fade')) {
			this.show(true).setStyle('opacity', 0);

			// We need to place opacity change on a timer or else it wont animate
			window.setTimeout(function() {
				this.setStyle('opacity', 1);
			}.bind(this), 50);

		// Slide down an element using CSS3 height transition
		// Use measure() so that we can determine the height of the element
		} else if (type === 'slide' || this.hasClass('slide')) {
			this.setStyle('height', this.measure(function() {
				return this.setStyle('height', 'auto').getHeight();
			}));

		// Set the display to the elements type
		} else {
			this.setStyle('display', '');
		}

		if (typeOf(callback) === 'function') {
			callback();
		}

		return this;
	},

	/**
	 * Hide the element either through fading, sliding, or direct display.
	 *
	 * @param {String|bool} [type]
	 * @param {Function} [callback]
	 * @returns {Element}
	 */
	hide: function(type, callback) {
		if (type === true) {
			this.setStyle('display', 'none');

		// Fade out the element using CSS3 opacity transition
		// Set a transitionend event to hide the element (display none) so that the element doesn't block the DOM
		} else if (type === 'fade' || this.hasClass('fade')) {
			var eventCallback = function() {
				this.hide(true).removeEvent('transitionend', eventCallback);
			};

			this.addEvent('transitionend', eventCallback).setStyle('opacity', 0);

		// Slide up an element using CSS3 height transition
		} else if (type === 'slide' || this.hasClass('slide')) {
			this.setStyle('height', 0);

		// Set the display to none
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
		var display = (this.getStyle('display') !== 'none');

		if (this.hasClass('fade')) {
			return (display && this.getStyle('opacity') > 0);

		} else if (this.hasClass('slide')) {
			return (display && this.getStyle('height').toInt() > 0);
		}

		return display;
	}

});

/**
 * Overwrite the default HTML setter and allow element nodes to be used.
 */
Element.Properties.html.set = function(html) {
	var htmlType = typeOf(html);

	// If we use get('html') it will only get the inner HTML
	// This approach will append the element itself
	if (htmlType === 'element') {
		this.innerHTML = '';
		this.appendChild(html);

		return this;
	}

	if (htmlType === 'string' && html.substr(0, 1) === '#') {
		html = document.getElement(html).get('html');

	} else if (htmlType === 'array') {
		html = html.join('');
	}

	this.innerHTML = html;

	return this;
};

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

/**
 * Custom events.
 */

var transitionEndEvent = (function() {
	var style = document.documentElement.style,
		transitions = {
			'transition': 'transitionend',
			'OTransition': 'oTransitionEnd',
			'MozTransition': 'transitionend',
			'WebkitTransition': 'webkitTransitionEnd',
			'MSTransitionEnd': 'msTransitionEnd'
		};

	for (var t in transitions){
		if (transitions.hasOwnProperty(t) && typeOf(style[t]) !== 'null') {
			return transitions[t];
		}
	}

	return null;
})();


Element.NativeEvents[transitionEndEvent] = 2;

})(window);

