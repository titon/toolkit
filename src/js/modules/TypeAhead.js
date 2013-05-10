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
		minLength: 1,
		itemLimit: 15,
		throttle: 250,
		prefetch: false,
		source: [],
		contentElement: '',
		template: '<div class="type-ahead"></div>',

		// Callbacks
		sorter: null,
		matcher: null,

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

		options = this.options;

		// Store the input
		this.input = $(id);

		if (this.input.get('tag') !== 'input') {
			throw new Error('TypeAhead must be initialized on an input field');
		} else {
			this.input.set('autocomplete', 'off');
		}

		// Use default callbacks
		if (options.sorter === null) {
			this.options.sorter = this.sorter;
		}

		if (options.matcher === null) {
			this.options.matcher = this.matcher;
		}

		// Prefetch source from URL
		if (options.prefetch && typeOf(options.source) === 'string') {
			var url = options.source;

			new Request.JSON({
				url: url,
				onSuccess: function(items) {
					this.items = items;
					this.cache[url] = items;
				}.bind(this)
			}).get();
		}

		// Set events
		this.disable().enable();

		this.fireEvent('init');
	},

	/**
	 * Highlight the current term within the item string.
	 * Split multi-word terms to highlight separately.
	 *
	 * @param {String} item
	 * @returns {String}
	 */
	highlight: function(item) {
		var terms = this.term.replace(/[\-\[\]{}()*+?.,\\^$|#]/g, "\\$&").split(" ");

		for (var i = 0, t; t = terms[i]; i++) {
			item = item.replace(new RegExp(t, "ig"), function(match) {
				return '<span class="highlight">' + match + '</span>';
			});
		}

		return item;
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
				var url = options.source;

				if (this.cache[url]) {
					this.process(this.cache[url]);
				} else {
					new Request.JSON({
						url: url,
						data: { term: term },
						onSuccess: this.process.bind(this)
					}).get();
				}
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
	 * Match an item if it contains the term.
	 *
	 * @param {String} item
	 * @param {String} term
	 * @returns {bool}
	 */
	matcher: function(item, term) {
		return (item.toLowerCase().indexOf(term.toLowerCase()) >= 0);
	},

	/**
	 * Process the list of items be generating new elements and positioning below the input.
	 *
	 * @param {Array} items
	 */
	process: function(items) {
		this.items = Array.from(items);
		this.index = -1;

		this._buildList();
		this._position();

		this.fireEvent('show');
	},

	/**
	 * Sort the items.
	 *
	 * @param {Array} items
	 * @returns {Array}
	 */
	sorter: function(items) {
		return items.sort();
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
			a,
			filteredItems = [],
			matcherType = typeOf(options.matcher);

		if (typeOf(options.sorter) === 'function') {
			items = options.sorter(items);
		}

		for (var i = 0, c = 0, l = items.length; i < l; i++) {
			item = items[i];

			if (c >= options.itemLimit) {
				break;

			} else if (matcherType === 'function' && !options.matcher(item, this.term)) {
				continue;
			}

			a = new Element('a', {
				html: this.highlight(item),
				href: 'javascript:;'
			});

			new Element('li', {
				'data-index': i
			}).grab(a).inject(ul);

			filteredItems.push(item);
			c++;
		}

		this.element.empty().grab(ul);

		// Reset item list since the original should be cached
		this.items = filteredItems;
		this.cache[this.term] = this.items;
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
				e.preventDefault();

				this.index = 0;
				this.fireEvent('select', [items[0], this.index]);
				this.hide();
			break;

			// Select current index
			case 'enter':
				this.fireEvent('select', [items[this.index], this.index]);
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
		if (!this.items.length) {
			this.hide();
			return;
		}

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