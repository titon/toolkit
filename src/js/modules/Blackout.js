/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Blackout = new Class({
	Extends: Titon.Component,

	/**
	 * Default options.
	 *
	 *	blur - (string) Apply a blur over the document, usually the wrapping div
	 */
	options: {
		blur: false,
		template: '<div class="blackout" id="titon-blackout"></div>',
		templateFrom: 'titon-blackout'
	},

	/**
	 * Add events for browser resizing.
	 *
	 * @param {Object} [options]
	 */
	initialize: function(options) {
		this.parent('.blackout', options);

		window.addEvent('resize', this.position.bind(this));

		this.fireEvent('init');
	},

	/**
	 * Hide the blackout and lower the display count.
	 *
	 * @return {Titon.Blackout}
	 */
	hide: function() {
		if (this.options.blur) {
			$(this.options.blur).removeClass('blur');
		}

		this.element.hide();
		this.fireEvent('hide');

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