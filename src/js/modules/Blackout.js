/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Blackout = new Class({
	Extends: Titon.Module,

	/**
	 * Default options.
	 */
	options: {
		blur: false,
		template: '<div class="blackout" id="titon-blackout"></div>',
		templateFrom: 'titon-blackout'
	},

	/**
	 * Add events for browser resizing.
	 *
	 * @param {Object} options
	 */
	initialize: function(options) {
		this.parent('.blackout', options);

		window.addEvent('resize', this.position.bind(this));

		this.fireEvent('init');
	},

	/**
	 * Return the current count.
	 *
	 * @return {int}
	 */
	count: function() {
		return Number.from(this.element.get('data-blackout-count') || 1);
	},

	/**
	 * Decrease the display count.
	 *
	 * @return {Titon.Blackout}
	 */
	decrease: function() {
		var count = this.count() - 1;

		if (count < 0) {
			count = 0;
		}

		this.element.set('data-blackout-count', count);

		return this;
	},

	/**
	 * Hide the blackout and lower the display count.
	 *
	 * @return {Titon.Blackout}
	 */
	hide: function() {
		var count = this.count();
			count--;

		if (count <= 0) {
			if (this.options.blur) {
				$(this.options.blur).removeClass('blur');
			}

			this.element.hide();
		}

		this.decrease();
		this.fireEvent('hide');

		return this;
	},

	/**
	 * Increase the display count.
	 *
	 * @return {Titon.Blackout}
	 */
	increase: function() {
		this.element.set('data-blackout-count', (this.count() + 1));

		return this;
	},

	/**
	 * Show the blackout and increase the display count.
	 *
	 * @return {Titon.Blackout}
	 */
	show: function() {
		if (this.options.blur) {
			$(this.options.blur).addClass('blur');
		}

		this.element.show();
		this.position();
		this.increase();
		this.fireEvent('show');

		return this;
	},

	/**
	 * Display and position the blackout.
	 *
	 * @return {Titon.Blackout}
	 */
	position: function() {
		if (this.isVisible()) {
			var size = window.getSize();

			this.element.setStyles({
				width: size.x,
				height: size.y
			});
		}

		return this;
	}

});

})();