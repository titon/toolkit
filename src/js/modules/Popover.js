/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Popover = new Class({
	Extends: Titon.Tooltip,

	/**
	 * Default options.
	 */
	options: {
		position: 'topCenter',
		getContent: 'data-popover',
		titleElement: '.popover-head',
		contentElement: '.popover-body',
		template: '<div class="popover">' +
			'<div class="popover-inner">' +
				'<div class="popover-head"></div>' +
				'<div class="popover-body"></div>' +
			'</div>' +
			'<div class="popover-arrow"></div>' +
		'</div>'
	},

	/**
	 * Initialize popovers.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		options = options || {};
		options.mode = 'click';
		options.follow = false;

		this.parent(query, options);
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Popover.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} options
 * @return {Titon.Popover}
 */
Titon.Popover.factory = function(query, options) {
	if (Titon.Popover.instances[query]) {
		return Titon.Popover.instances[query];
	}

	var instance = new Titon.Popover(query, options);

	Titon.Popover.instances[query] = instance;

	return instance;
};

/**
 * Hide all instances.
 */
Titon.Popover.hide = function() {
	Object.each(Titon.Popover.instances, function(popover) {
		popover.hide();
	});
};

})();