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
	 */
	options: {
		getTarget: 'data-toggle'
	},

	/**
	 * Initialize toggles.
	 *
	 * @param {String} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		options = options || {};
		options.multiElement = true;

		this.parent(query, options);

		this.disable().enable();

		this.fireEvent('init');
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

		var element = $(target.remove('#'));

		if (!element) {
			return;
		}

		this.element = element;

		if (!this.isVisible()) {
			node.addClass(Titon.options.activeClass);
			this.show(node);

		} else {
			node.removeClass(Titon.options.activeClass);
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