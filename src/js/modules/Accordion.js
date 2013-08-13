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
		headerElement: '.accordion-head',
		contentElement: '.accordion-inner',
		multiElement: true
	},

	/**
	 * Apply to all accordions in the page.
	 * Trigger the default row and toggle events.
	 *
	 * @param {String} query
	 * @param {Object} [options]
	 */
	initialize: function(query, options) {
		this.parent(options);
		this.setElements(query);

		// Hide all sections besides the defaultIndex
		this.element.each(function(accordion) {
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

			// Cache the height so we can use for sliding
			sections.each(function(section) {
				section.set('data-height', section.getHeight());
			}).conceal();

			this.show(header);
		}.bind(this));

		// Set events
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
			parent = node.getParent(), // li
			wrapper = parent.getParent(), // ul
			section = node.getNext(options.contentElement), // section
			activeClass = Titon.options.activeClass;

		// If we don't double the height the animation won't occur
		var height = section.get('data-height') * 2;

		// Allow simultaneous open and closed sections
		// Or allow the same section to collapse
		if (options.multiple || (options.collapsible && this.node === node)) {
			if (section.isShown()) {
				section.setStyle('max-height', 0).conceal();
				parent.removeClass(activeClass);

			} else {
				section.setStyle('max-height', height).reveal();
				parent.addClass(activeClass);
			}

		// Only one open at a time
		} else {

			// Exit early so we don't mess with animations
			if (this.node === node) {
				return;
			}

			wrapper.getElements(options.contentElement).setStyle('max-height', 0).conceal();
			section.setStyle('max-height', height).reveal();

			wrapper.getElements('li').removeClass(activeClass);
			parent.addClass(activeClass);
		}

		this.node = node;
		this.fireEvent('show', section);
	},

	/**
	 * Event callback for tab element click or hover.
	 *
	 * @private
	 * @param {Event} e
	 */
	_show: function(e) {
		var target = e.target,
			headerClass = this.options.headerElement.remove('.');

		// Fetch the header in case a child is clicked
		while (target && !target.hasClass(headerClass)) {
			target = target.getParent();
		}

		if (!target) {
			return;
		}

		this.show(target);
	},

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.Accordion}
	 */
	_toggleEvents: function(on) {
		if (!this.element) {
			return this;
		}

		var event = (this.options.mode === 'click') ? 'click' : 'mouseover';

		this.element.each(function(accordion) {
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