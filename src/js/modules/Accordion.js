/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Accordion = new Class({
	Extends: Titon.Module,

	options: {
		mode: 'click',
		slide: true,
		multiple: false,
		collapsible: false,
		headerElement: 'header',
		contentElement: 'section',
		multiElement: true
	},

	initialize: function(query, options) {
		this.parent(query, options);

		// Setup state
		this.elements = $$(query);
		this.elements.each(function(accordion) {
			accordion.getElements(this.options.contentElement).each(function(section, index) {
				if (index > 0) {
					section.hide();
				}
			});
		}.bind(this));

		this.disable().enable();

		this.fireEvent('init');
	},

	show: function(node) {
		this.node = node;

		var parent = node.getParent(this.query),
			options = this.options,
			activeClass = Titon.options.activeClass;

		// Set active styles
		//

		// Targets
		var section = node.getNext(options.contentElement);

		if (options.collapsible) {
			if (section.isVisible()) {
				this.hideElement(section);
				node.removeClass(activeClass);
			} else {
				this.showElement(section);
				node.addClass(activeClass);
			}

		} else {
			parent.getElements(options.headerElement).removeClass(Titon.options.activeClass);
			node.addClass(Titon.options.activeClass);

			var toShow = node.getNext(options.contentElement),
				toHide = parent.getElements(options.contentElement);

			toHide.hide();
			toShow.show();
		}
	},

	/**
	 * Event callback for tab element click.
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
	 * @return {Titon.Tabs}
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
 * @param {Object} options
 * @return {Titon.Tooltip}
 */
Titon.Accordion.factory = function(query, options) {
	if (Titon.Accordion.instances[query]) {
		return Titon.Accordion.instances[query];
	}

	var instance = new Titon.Accordion(query, options);

	Titon.Accordion.instances[query] = instance;

	return instance;
};

/**
 * Hide all instances.
 */
Titon.Accordion.hide = function() {
	Object.each(Titon.Accordion.instances, function(acc) {
		acc.hide();
	});
};

})();