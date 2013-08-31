/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.TypeAhead = new Class({
	Extends: Titon.Component,
	Implements: [Cache],
	Binds: ['_cycle', '_lookup', 'process', 'rewind'],

	/** Input element to display menu against */
	input: null,

	/** Shadow input element */
	shadow: null,

	/** Current active index when cycling through the list */
	index: -1,

	/** List of items to display and match against */
	items: [],

	/** Current term used during lookup and matching */
	term: '',

	/** Throttle timer */
	timer: null,

	/**
	 * Default options.
	 *
	 *	source			- (string|function|array) The source data to use for list building
	 *	minLength		- (int) Minimum character length before lookup triggers
	 *	itemLimit		- (int) Max items to display in the list
	 *	throttle		- (int) Time in milliseconds before each lookup is triggered; Reduces AJAX requests
	 *	prefetch		- (bool) Will prefetch and cache the source if the source is an AJAX call
	 *	shadow			- (bool) Will display shadow text behind the input that correlates to the first available match
	 *	storage			- (string) The storage layer to use for caching: local, session, memory
	 *	query			- (object) Query string of key value pairs to append to the AJAX request
	 *	contentElement	- (string) CSS query for the element that lists are inserted to
	 *	titleElement	- (string) CSS query for the title element within the list item
	 *	descElement		- (string) CSS query for the description element within the list item
	 *	shadowElement	- (string) CSS query for the shadow wrapping div
	 *	sorter			- (function) Callback to use for data sorting
	 *	matcher			- (function) Callback to use for data matching
	 *	builder			- (function) Callback to use for list item building
	 *	onSelect		- (function) Callback to trigger when a list item is selected
	 *	onReset			- (function) Callback to trigger when the list is reset
	 */
	options: {
		source: [],
		minLength: 1,
		itemLimit: 15,
		throttle: 250,
		prefetch: false,
		shadow: false,
		storage: 'session',
		query: {},
		contentElement: '',
		titleElement: '.type-ahead-title',
		descElement: '.type-ahead-desc',
		shadowElement: '.type-ahead-shadow',
		template: '<div class="type-ahead"></div>',

		// Callbacks
		sorter: null,
		matcher: null,
		builder: null,

		// Events
		onSelect: null,
		onReset: null
	},

	/**
	 * Store the input reference and trigger events.
	 *
	 * @param {String} id
	 * @param {Object} [options]
	 */
	initialize: function(id, options) {
		this.parent(options);
		this.createElement();

		// Store the input
		this.input = document.getElement(id);

		if (!this.input || !this.element) {
			return;
		}

		if (this.input.get('tag') !== 'input') {
			throw new Error('TypeAhead must be initialized on an input field');
		} else {
			this.input.set('autocomplete', 'off');
		}

		// Setup state
		options = this.options;

		this.setStorage(options.storage);

		// Use default callbacks
		Object.each({ sorter: 'sort', matcher: 'match', builder: 'build' }, function(fn, key) {
			if (options[key] === false) {
				return;
			}

			var callback;

			if (options[key] === null || typeOf(options[key]) !== 'function') {
				callback = this[fn];
			} else {
				callback = options[key];
			}

			this.options[key] = callback.bind(this);
		}.bind(this));

		// Prefetch source from URL
		if (options.prefetch && typeOf(options.source) === 'string') {
			var url = options.source;

			new Request.JSON({
				url: url,
				data: options.query,
				onSuccess: function(items) {
					this.setCache(url, items);
				}.bind(this)
			}).get();
		}

		// Enable shadow inputs
		if (options.shadow) {
			this.node = new Element('div' + options.shadowElement).wraps(this.input);

			this.shadow = this.input.clone()
				.addClass('is-shadow')
				.set('readonly', true)
				.inject(this.node, 'top');

			this.input.addClass('not-shadow');
		}

		// Set events
		window.addEvent('keydown', function(e) {
			if (e.key === 'esc') {
				Titon.TypeAhead.hide();
			}
		});

		this.disable().enable();

		this.fireEvent('init');
	},

	/**
	 * Build the anchor link that will be used in the list.
	 *
	 * @param {Object} item
	 * @returns {HTMLElement}
	 */
	build: function(item) {
		var a = new Element('a', {
			href: 'javascript:;'
		});

		a.grab( new Element('span' + this.options.titleElement, {
			html: this.highlight(item.title)
		}) );

		if (item.description) {
			a.grab( new Element('span' + this.options.descElement, {
				html: item.description
			}) );
		}

		return a;
	},

	/**
	 * Hide the list and reset shadow.
	 */
	hide: function() {
		if (this.shadow) {
			this.shadow.set('value', '');
		}

		this.parent();
	},

	/**
	 * Highlight the current term within the item string.
	 * Split multi-word terms to highlight separately.
	 *
	 * @param {String} item
	 * @returns {String}
	 */
	highlight: function(item) {
		var terms = this.term.replace(/[\-\[\]\{\}()*+?.,\\^$|#]/g, '\\$&').split(' '),
			callback = function(match) {
				return '<span class="type-ahead-highlight">' + match + '</span>';
			};

		for (var i = 0, t; t = terms[i]; i++) {
			item = item.replace(new RegExp(t, 'ig'), callback);
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
		this.timer = window.setTimeout(function() {
			var options = this.options,
				sourceType = typeOf(options.source);

			// Check the cache first
			if (this.cache[term.toLowerCase()]) {
				this.process(this.cache[term.toLowerCase()]);

			// Use the response of an AJAX request
			} else if (sourceType === 'string') {
				var url = options.source,
					cache = this.getCache(url);

				if (cache) {
					this.process(cache);
				} else {
					var query = options.query;
						query.term = term;

					new Request.JSON({
						url: url,
						data: query,
						onSuccess: this.process
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
	match: function(item, term) {
		return (item.toLowerCase().indexOf(term.toLowerCase()) >= 0);
	},

	/**
	 * Process the list of items be generating new elements and positioning below the input.
	 *
	 * @param {Array} items
	 */
	process: function(items) {
		if (!this.term.length || !items.length) {
			this.hide();
			return;
		}

		var options = this.options,
			categories = { _empty_: [] },
			item,
			list = new Element('ul');

		// Reset
		this.items = [];
		this.index = -1;

		// Sort and match the list of items
		if (typeOf(options.sorter) === 'function') {
			items = options.sorter(items);
		}

		if (typeOf(options.matcher) === 'function') {
			items = items.filter(function(item) {
				return options.matcher(item.title, this.term);
			}.bind(this));
		}

		// Group the items into categories
		for (var i = 0; item = items[i]; i++) {
			if (item.category) {
				if (!categories[item.category]) {
					categories[item.category] = [];
				}

				categories[item.category].push(item);
			} else {
				categories._empty_.push(item);
			}
		}

		// Loop through the items and build the markup
		var results = [],
			count = 0;

		Object.each(categories, function(items, category) {
			var elements = new Elements();

			if (category !== '_empty_') {
				results.push(null);

				elements.push(
					new Element('li').addClass('heading').grab(new Element('span', { text: category }))
				);
			}

			for (var i = 0, a; item = items[i]; i++) {
				if (count >= options.itemLimit) {
					break;
				}

				a = options.builder(item);
				a.addEvents({
					mouseover: this.rewind,
					click: this._select.pass(results.length, this)
				});

				elements.push( new Element('li').grab(a) );
				results.push(item);
				count++;
			}

			elements.inject(list);
		}.bind(this));

		// Append list
		this.element.empty();

		if (options.contentElement) {
			this.element.getElement(options.contentElement).grab(list);
		} else {
			this.element.grab(list);
		}

		// Set the current result set to the items list
		// This will be used for index cycling
		this.items = results;

		// Cache the result set to the term
		// Filter out null categories so that we can re-use the cache
		this.cache[this.term.toLowerCase()] = results.filter(function(item) {
			return (item !== null);
		});

		// Apply the shadow text
		this._shadow();

		// Position the list
		this._position();

		this.fireEvent('show');
	},

	/**
	 * Rewind the cycle pointer to the beginning.
	 */
	rewind: function() {
		this.index = -1;
		this.element.getElements('li').removeClass(Titon.options.activeClass);
	},

	/**
	 * Select an item in the list.
	 *
	 * @param {int} index
	 */
	select: function(index) {
		this.index = index;

		var rows = this.element.getElements('li'),
			activeClass = Titon.options.activeClass;

		rows.removeClass(activeClass);

		// Select
		if (index >= 0) {
			if (this.items[index]) {
				var item = this.items[index];

				rows[index].addClass(activeClass);

				this.input.set('value', item.title);

				this.fireEvent('select', [item, index]);
			}
		// Reset
		} else {
			this.input.set('value', this.term);

			this.fireEvent('reset');
		}
	},

	/**
	 * Sort the items.
	 *
	 * @param {Array} items
	 * @returns {Array}
	 */
	sort: function(items) {
		return items.sort(function(a, b) {
			return a.title.localeCompare(b.title);
		});
	},

	/**
	 * Cycle through the items in the list when an arrow key, esc or enter is released.
	 *
	 * @private
	 * @param {DOMEvent} e
	 */
	_cycle: function(e) {
		var items = this.items,
			length =  items.length.limit(0, this.options.itemLimit);

		if (!length || !this.isVisible()) {
			return;
		}

		switch (e.key) {
			// Cycle upwards
			case 'up':
				this.index -= (items[this.index - 1] ? 1 : 2); // category check

				if (this.index < 0) {
					this.index = length;
				}
			break;

			// Cycle downwards
			case 'down':
				this.index += (items[this.index + 1] ? 1 : 2); // category check

				if (this.index >= length) {
					this.index = -1;
				}
			break;

			// Select first
			case 'tab':
				e.preventDefault();

				var i = 0;

				while (!this.items[i]) {
					i++;
				}

				this.index = i;
				this.hide();
			break;

			// Select current index
			case 'enter':
				this.hide();
			break;

			// Reset
			case 'esc':
				this.index = -1;
				this.hide();
			break;

			// Cancel others
			default:
				return;
		}

		if (this.shadow) {
			this.shadow.set('value', '');
		}

		// Select the item
		this.select(this.index);
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

		window.clearTimeout(this.timer);

		var term = this.input.get('value').trim();

		if (term.length < this.options.minLength) {
			this.fireEvent('reset');
			this.hide();

		} else {
			this._shadow();
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
		});

		this.element.reveal();
	}.protect(),

	/**
	 * Event callback to select an item from the list.
	 *
	 * @private
	 * @param {int} index
	 */
	_select: function(index) {
		this.select(index);
		this.hide();
	},

	/**
	 * Monitor the current input term to determine the shadow text.
	 * Shadow text will reference the term cache.
	 *
	 * @private
	 */
	_shadow: function() {
		if (!this.shadow) {
			return;
		}

		var term = this.input.get('value'),
			termLower = term.toLowerCase(),
			value = '';

		if (this.cache[termLower] && this.cache[termLower][0]) {
			var title = this.cache[termLower][0].title;

			if (title.toLowerCase().indexOf(termLower) === 0) {
				value = term + title.substr(term.length, (title.length - term.length));
			}
		}

		this.shadow.set('value', value);
	}.protect(),

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.TypeAhead}
	 */
	_toggleEvents: function(on) {
		if (!this.input) {
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
 * @param {String} id
 * @param {Object} [options]
 * @return {Titon.TypeAhead}
 */
Titon.TypeAhead.factory = function(id, options) {
	if (Titon.TypeAhead.instances[id]) {
		return Titon.TypeAhead.instances[id];
	}

	var instance = new Titon.TypeAhead(id, options);

	Titon.TypeAhead.instances[id] = instance;

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