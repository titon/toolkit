/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Displays a transparent black element over the entire website.
 *
 * @version	0.1
 * @uses	Titon
 * @uses	Core
 */
Titon.Blackout = new Class({
	Implements: [Events, Options],

	/**
	 * DOM element.
	 */
	element: null,

	/**
	 * Default options.
	 *
	 *	onHide	- (function) Callback to trigger when the blackout is hidden
	 *	onShow	- (function) Callback to trigger when the blackout is shown
	 */
	options: {
		onHide: null,
		onShow: null
	},

	/**
	 * Initialize the blackout element. If it already exists use it, else create it.
	 *
	 * @param {object} options
	 */
	initialize: function(options) {
		this.setOptions(options);

		var element = $('titon-blackout');

		if (!element) {
			element = new Element('div.' + Titon.options.prefix + 'blackout', { id: 'titon-blackout' });
			element.inject(document.body).hide();
		}

		this.element = element;
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
		var size = window.getSize();

		this.element.show().setStyles({
			width: size.x,
			height: size.y
		});

		this.increase();
		this.fireEvent('show');

		return this;
	}

});