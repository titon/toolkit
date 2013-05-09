/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.TypeAhead = new Class({
	Extends: Titon.Module,
	Binds: ['_cycle', '_lookup'],

	/**
	 * Input element to display menu against.
	 */
	input: null,

	/**
	 * Current active index when cycling through the list.
	 */
	index: -1,

	/**
	 * List of items to display and match against.
	 */
	items: [],

	/**
	 * Current term used during lookup and matching.
	 */
	term: '',

	/**
	 * Throttle timer.
	 */
	timer: null,

	/**
	 * Default options.
	 */
	options: {
		minLength: 2,
		itemLimit: 15,
		throttle: 200,
		source: [],
		sorter: null,
		filter: null,
		matcher: null,
		template: '<div class="type-ahead"></div>',

		// Events
		onSelect: null,
		onReset: null
	},

	/**
	 * Store the input reference and trigger events.
	 *
	 * @param {String} id
	 * @param {Object} options
	 */
	initialize: function(id, options) {
		this.parent(id, options);

		// Store the input
		this.input = $(id);

		if (this.input.get('tag') !== 'input') {
			throw new Error('TypeAhead must be initialized on an input field');
		} else {
			this.input.set('autocomplete', 'off');
		}

		// Set events
		this.disable().enable();

		this.fireEvent('init');
	},

	/**
	 * Load the list of items to use for look ups.
	 * Trigger different actions depending on the type of source.
	 *
	 * @param {String} term
	 */
	lookup: function(term) {
		this.term = term;

		if (this.timer !== null) {
			window.clearTimeout(this.timer);
			this.timer = null;
		}

		this.timer = window.setTimeout(function() {
			var options = this.options,
				sourceType = typeOf(options.source);

			// Check the cache first
			if (this.cache[term]) {
				this.process(this.cache[term]);

			// Use the response of an AJAX request
			} else if (sourceType === 'string') {
				new Request.JSON({
					url: options.source,
					data: { term: term },
					onSuccess: this.process.bind(this)
				}).get();

			// Use a literal array list
			} else if (sourceType === 'array') {
				this.process(options.source);

			// Use the return of a function
			} else if (sourceType === 'function') {
				var response = options.source.attempt([], this);

				if (response) {
					this.process(response);
				}
			} else {
				throw new Error('Invalid TypeAhead source type');
			}
		}.bind(this), this.options.throttle);
	},

	/**
	 * Process the list of items be generating new elements and positioning below the input.
	 *
	 * @param {Array} items
	 */
	process: function(items) {
		this.items = Array.from(items);

		// Cache the data
		if (this.term) {
			this.cache[this.term] = this.items;
		}

		// Build a new menu
		this._buildList();
		this._position();

		this.fireEvent('show');
	},

	/**
	 * Generate the list of items to display.
	 * Items will be passed through a filter, sorter and matcher, in that order.
	 *
	 * @private
	 */
	_buildList: function() {
		var options = this.options,
			items = this.items,
			item,
			ul = new Element('ul'),
			li, a;

		// TODO filter
		// TODO sorter
		// TODO matcher

		for (var i = 0, l = items.length; i < l; i++) {
			if (i >= options.itemLimit) {
				break;
			}

			item = items[i];

			a = new Element('a', {
				text: item,
				href: 'javascript:;'
			});

			li = new Element('li');
			li.grab(a).inject(ul);
		}

		this.element.empty().grab(ul);
	},

	/**
	 * Cycle through the items in the list when an arrow key, esc or enter is released.
	 *
	 * @private
	 * @param {DOMEvent} e
	 */
	_cycle: function(e) {
		var items = this.items,
			length = items.length.limit(0, this.options.itemLimit);

		if (!length || !this.isVisible()) {
			return;
		}

		switch (e.key) {
			// Cycle upwards
			case 'up':
				this.index--;

				if (this.index < 0) {
					this.index = length - 1;
				}
			break;

			// Cycle downwards
			case 'down':
				this.index++;

				if (this.index >= length) {
					this.index = 0;
				}
			break;

			// Select first
			case 'tab':
				this.index = 0;
				this.fireEvent('select', [0, items[0]]);
				this.hide();
			break;

			// Select current index
			case 'enter':
				this.fireEvent('select', [this.index, items[this.index]]);
				this.hide();
			break;

			// Reset
			case 'esc':
				this.index = -1;
				this.input.set('value', this.term);
				this.fireEvent('reset');
				this.hide();
			break;

			// Cancel others
			default:
				return;
			break;
		}

		// Select the item
		var rows = this.element.getElements('li'),
			activeClass = Titon.options.activeClass;

		rows.removeClass(activeClass);

		if (this.index >= 0) {
			rows[this.index].addClass(activeClass);
			this.input.set('value', items[this.index]);
		}
	},

	/**
	 * Lookup items based on the current input value.
	 *
	 * @private
	 * @param {DOMEvent} e
	 */
	_lookup: function(e) {
		if (['up', 'down', 'esc', 'tab', 'enter'].contains(e.key)) {
			return; // Handle with _cycle()
		}

		var term = this.input.get('value').trim();

		if (term.length < this.options.minLength) {
			this.hide();

		} else {
			this.lookup(term);
		}
	},

	/**
	 * Position the menu below the input.
	 *
	 * @private
	 */
	_position: function() {
		var iPos = this.input.getCoordinates();

		this.element.setPosition({
			x: iPos.left,
			y: (iPos.top + iPos.height)
		}).hide();

		this.showElement();
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

		var events = {
			keyup: this._lookup,
			keydown: this._cycle
		};

		if (on) {
			this.input.addEvents(events);
		} else {
			this.input.removeEvents(events);
		}

		return this;
	}.protect()

});

/**
 * All instances loaded via factory().
 */
Titon.TypeAhead.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} options
 * @return {Titon.TypeAhead}
 */
Titon.TypeAhead.factory = function(query, options) {
	if (Titon.TypeAhead.instances[query]) {
		return Titon.TypeAhead.instances[query];
	}

	var instance = new Titon.TypeAhead(query, options);

	Titon.TypeAhead.instances[query] = instance;

	return instance;
};

/**
 * Hide all instances.
 */
Titon.TypeAhead.hide = function() {
	Object.each(Titon.TypeAhead.instances, function(ta) {
		ta.hide();
	});
};

})();