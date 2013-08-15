/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function(window) {
	'use strict';

window.Titon = {

	/** Current version. */
	version: '0.5.0',

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
	 * Reveal the element by applying the show class.
	 * Should be used to trigger transitions and animations.
	 *
	 * @returns {Element}
	 */
	reveal: function() {
		return this.swapClass('hide', 'show');
	},

	/**
	 * Conceal the element by applying the hide class.
	 * Should be used to trigger transitions and animations.
	 *
	 * @returns {Element}
	 */
	conceal: function() {
		return this.swapClass('show', 'hide');
	},

	/**
	 * Used for animations. Do not conflict with isVisible() or isHidden().
	 *
	 * @returns {boolean}
	 */
	isShown: function() {
		return (this.getStyle('visibility') !== 'hidden');
	}

});

/**
 * Override the default HTML setter and allow element nodes to be used.
 */
Element.Properties.html.set = function(html) {
	var type = typeOf(html);

	// If we use get('html') it will only get the inner HTML
	// This approach will append the element itself
	if (type === 'element') {
		this.innerHTML = '';
		this.appendChild(html);

		return this;
	}

	if (type === 'string' && html.substr(0, 1) === '#') {
		html = document.getElement(html).get('html');

	} else if (type === 'array') {
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

