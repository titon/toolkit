/**
 * Titon: The Mootools UI Framework
 *
 * @copyright	Copyright 2006-2012, Titon
 * @license		http://opensource.org/licenses/mit-license.php - Licensed under the MIT License
 * @link		http://github.com/titon
 */

/**
 * Displays a transparent black element over the entire website.
 *
 * @version	1.0.0
 * @uses	Titon
 * @uses	Titon.Module
 * @uses	Core
 */
Titon.Blackout = new Class({
	Extends: Titon.Module,

	/**
	 * Default options.
	 *
	 *	onHide			- (function) Callback to trigger when the blackout is hidden
	 *	onShow			- (function) Callback to trigger when the blackout is shown
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	templateFrom	- (string) ID of an element to use as the template
	 */
	options: {
		onHide: null,
		onShow: null,
		template: '<div class="blackout" id="titon-blackout"></div>',
		templateFrom: 'titon-blackout'
	},

	/**
	 * Add events for browser resizing.
	 */
	initialize: function() {
		this.parent();

		window.addEvent('resize', this.position.bind(this));
	},

	/**
	 * Return the current count.
	 *
	 * @return {int}
	 */
	count: function() {
		return Number.from(this.element.get('data-blackout-count') || 0);
	},

	/**
	 * Decrease the display count.
	 *
	 * @return {Titon.Blackout}
	 */
	decrease: function() {
		this.element.set('data-blackout-count', (this.count() - 1));

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
		var size = window.getSize();

		this.element.show().setStyles({
			width: size.x,
			height: size.y
		});

		return this;
	}

});