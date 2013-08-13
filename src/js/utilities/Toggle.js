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
	 * @param {String} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		this.parent(options);
		this.bindTo(query);

		this.disable().enable();

		window.addEvent('click', this.hide.bind(this));

		this.fireEvent('init');
	},

	/**
	 * Toggle node class.
	 */
	hide: function() {
		this.parent(function() {
			this.node.removeClass(Titon.options.activeClass);
		}.bind(this));
	},

	/**
	 * Toggle node class.
	 */
	show: function(node) {
		this.parent(node);
		this.node.addClass(Titon.options.activeClass);
	},

	/**
	 * When a node is clicked, grab the target from the attribute.
	 * Validate the target element, then either display or hide.
	 *
	 * @param {DOMEvent} e
	 * @param {Element} node
	 * @private
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
 * All instances loaded via factory().
 */
Titon.Toggle.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} [options]
 * @return {Titon.Toggle}
 */
Titon.Toggle.factory = function(query, options) {
	if (Titon.Toggle.instances[query]) {
		return Titon.Toggle.instances[query];
	}

	var instance = new Titon.Toggle(query, options);

	Titon.Toggle.instances[query] = instance;

	return instance;
};

})();