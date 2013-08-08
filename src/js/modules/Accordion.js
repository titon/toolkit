/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Accordion = new Class({
	Extends: Titon.Component,

	/**
	 * Default options.
	 *
	 *	defaultIndex	- (int) Index of the row to display by default
	 *	multiple		- (bool) Allow multiple sections to be open simultaneously
	 *	collapsible		- (bool) Hide the section if the row is clicked again
	 *	headerElement	- (string) CSS query for the header element within the row
	 *	contentElement	- (string) CSS query for the content element within the row
	 */
	options: {
		mode: 'click',
		defaultIndex: 0,
		multiple: false,
		collapsible: false,
		headerElement: 'header',
		contentElement: 'section',
		multiElement: true
	},

	/**
	 * Apply module to all accordions in the page.
	 * Trigger the default row and toggle events.
	 *
	 * @param {String} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		this.parent(query, options);

		this.elements = $$(query);

		// Hide all sections besides the defaultIndex
		this.elements.each(function(accordion) {
			var options = this.options,
				sections = accordion.getElements(options.contentElement),
				headers = accordion.getElements(options.headerElement),
				header = headers[0];

			// Fall back to first row if the default doesn't exist
			if (headers[options.defaultIndex]) {
				header = headers[options.defaultIndex];
			}

			// Reset the state of every row
			accordion.getElements('li').removeClass(Titon.options.activeClass);
			sections.hide();

			this.show(header);
		}.bind(this));

		this.disable().enable();

		this.fireEvent('init');
	},

	/**
	 * Toggle the section display of a row via the header click/hover event.
	 * Take into account the multiple and collapsible options.
	 *
	 * @param {Element} node
	 */
	show: function(node) {
		var options = this.options,
			wrapper = node.getParent(this.query), // ul
			parent = node.getParent(), // li
			section = node.getNext(options.contentElement), // section
			activeClass = Titon.options.activeClass;

		// Allow simultaneous open and closed sections
		// Or allow the same section to collapse
		if (options.multiple || (options.collapsible && this.node === node)) {
			if (section.isVisible()) {
				section.hide();
				parent.removeClass(activeClass);

			} else {
				section.show();
				parent.addClass(activeClass);
			}

		// Only one open at a time
		} else {

			// Exit early so we don't mess with animations
			if (this.node === node) {
				return;
			}

			wrapper.getElements(options.contentElement).hide();
			section.show();

			wrapper.getElements('li').removeClass(activeClass);
			parent.addClass(activeClass);
		}

		this.node = node;
	},

	/**
	 * Event callback for tab element click or hover.
	 *
	 * @private
	 * @param {Event} e
	 */
	_show: function(e) {
		this.show(e.target);
	},

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.Accordion}
	 */
	_toggleEvents: function(on) {
		if (!this.query) {
			return this;
		}

		var event = (this.options.mode === 'click') ? 'click' : 'mouseover';

		this.elements.each(function(accordion) {
			var headers = accordion.getElements(this.options.headerElement);

			if (on) {
				headers.addEvent(event, this._show);
			} else {
				headers.removeEvent(event, this._show);
			}
		}.bind(this));

		return this;
	}.protect()

});

/**
 * All instances loaded via factory().
 */
Titon.Accordion.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} [options]
 * @return {Titon.Accordion}
 */
Titon.Accordion.factory = function(query, options) {
	if (Titon.Accordion.instances[query]) {
		return Titon.Accordion.instances[query];
	}

	var instance = new Titon.Accordion(query, options);

	Titon.Accordion.instances[query] = instance;

	return instance;
};

})();