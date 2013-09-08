/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Toggle = new Class({
	Extends: Titon.Component,

	/**
	 * Default options.
	 *
	 *	getTarget	- (string) Attribute to fetch the target ID from
	 *	hideOpened	- (bool) Hide other dropdowns that are currently open
	 */
	options: {
		getTarget: 'data-toggle',
		hideOpened: true
	},

	/**
	 * Initialize toggles.
	 *
	 * @param {Elements} elements
	 * @param {Object} [options]
	 */
	initialize: function(elements, options) {
		this.parent(options);
		this.setNodes(elements);

		this.disable().enable();

		window.addEvent('click', this.hide.bind(this));

		this.fireEvent('init');
	},

	/**
	 * Toggle node class.
	 *
	 * @returns {Titon.Toggle}
	 */
	hide: function() {
		return this.parent(function() {
			this.node.removeClass(Titon.options.activeClass);
		}.bind(this));
	},

	/**
	 * Toggle node class.
	 *
	 * @returns {Titon.Toggle}
	 */
	show: function(node) {
		this.parent(node);
		this.node.addClass(Titon.options.activeClass);

		return this;
	},

	/**
	 * When a node is clicked, grab the target from the attribute.
	 * Validate the target element, then either display or hide.
	 *
	 * @private
	 * @param {DOMEvent} e
	 * @param {Element} node
	 */
	_show: function(e, node) {
		if (typeOf(e) === 'domevent') {
			e.stop();
		}

		var target = this.getValue(node, this.options.getTarget);

		if (!target || target.substr(0, 1) !== '#') {
			return;
		}

		if (this.options.hideOpened && this.node && this.node !== node) {
			this.hide();
		}

		this.setElement(target);

		if (!this.isVisible()) {
			this.show(node);
		} else {
			this.hide();
		}
	}

});

/**
 * Enable dropdowns on Elements collections by calling dropdown().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 * 		$$('.js-dropdown').dropdown({
 * 			hideOpened: true
 * 		});
 *
 * @param {Object} [options]
 * @returns {Titon.Toggle}
 */
Elements.implement('dropdown', function(options) {
	if (this.$dropdown) {
		return this.$dropdown;
	}

	options = options || {};
	options.delegate = options.delegate || '.js-dropdown';

	this.$dropdown = new Titon.Toggle(this, options);

	return this.$dropdown;
});

})();