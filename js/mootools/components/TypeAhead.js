/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.TypeAhead = new Class({
    Extends: Toolkit.Component,
    Implements: [Cache],
    Binds: ['source', 'rewind', 'onCycle', 'onFind', 'onLookup'],

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

    /** Default options */
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
        template: '<div class="type-ahead"></div>',

        // Callbacks
        sorter: null,
        matcher: null,
        builder: null
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} input
     * @param {Object} [options]
     */
    initialize: function(input, options) {
        this.parent(options);
        this.createElement();
        this.options = options = this.inheritOptions(this.options, input);

        // Store the input
        this.input = input;

        if (input.get('tag') !== 'input') {
            throw new Error('TypeAhead must be initialized on an input field');
        } else {
            input.set('autocomplete', 'off');
        }

        // Setup state
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
            this.node = new Element('div.' + Toolkit.options.vendor + 'type-ahead-shadow').wraps(this.input);

            this.shadow = this.input.clone()
                .addClass(Toolkit.options.isPrefix + 'shadow')
                .removeProperty('id')
                .set('readonly', true)
                .inject(this.node, 'bottom');

            this.input.addClass('not-shadow');
        }

        // Initialize events
        this.events = {
            'keyup input': 'onLookup',
            'keydown input': 'onCycle',
            'clickout element': 'hide'
        };

        this.enable();
        this.fireEvent('init');
    },

    /**
     * Build the anchor link that will be used in the list.
     *
     * @param {Object} item
     * @returns {Element}
     */
    build: function(item) {
        var a = new Element('a', {
            href: 'javascript:;'
        });

        a.grab( new Element('span.' + Toolkit.options.vendor + 'type-ahead-title', {
            html: this.highlight(item.title)
        }) );

        if (item.description) {
            a.grab( new Element('span.' + Toolkit.options.vendor + 'type-ahead-desc', {
                html: item.description
            }) );
        }

        return a;
    },

    /**
     * Hide the list and reset shadow.
     *
     * @returns {Toolkit.TypeAhead}
     */
    hide: function() {
        if (this.shadow) {
            this.shadow.set('value', '');
        }

        return this.parent();
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
                return '<mark class="' + Toolkit.options.vendor + 'type-ahead-highlight">' + match + '</mark>';
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
     * @returns {Toolkit.TypeAhead}
     */
    lookup: function(term) {
        this.term = term;
        this.timer = setTimeout(this.onFind, this.options.throttle);

        return this;
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
     * Position the menu below the input.
     *
     * @returns {Toolkit.TypeAhead}
     */
    position: function() {
        if (!this.items.length) {
            return this.hide();
        }

        var iPos = this.input.getCoordinates();

        this.element.setPosition({
            x: iPos.left,
            y: (iPos.top + iPos.height)
        });

        this.element.reveal();

        return this;
    },

    /**
     * Rewind the cycle pointer to the beginning.
     *
     * @returns {Toolkit.TypeAhead}
     */
    rewind: function() {
        this.index = -1;
        this.element.getElements('li').removeClass(Toolkit.options.isPrefix + 'active');

        return this;
    },

    /**
     * Select an item in the list.
     *
     * @param {Number} index
     * @param {String} [event]
     * @returns {Toolkit.TypeAhead}
     */
    select: function(index, event) {
        this.index = index;

        var rows = this.element.getElements('li');

        rows.removeClass(Toolkit.options.isPrefix + 'active');

        // Select
        if (index >= 0) {
            if (this.items[index]) {
                var item = this.items[index];

                rows[index].addClass(Toolkit.options.isPrefix + 'active');

                this.input.set('value', item.title);

                this.fireEvent(event || 'select', [item, index]);
            }

        // Reset
        } else {
            this.input.set('value', this.term);

            this.fireEvent('reset');
        }

        return this;
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
     * Process the list of items be generating new elements and positioning below the input.
     *
     * @param {Array} items
     * @returns {Toolkit.TypeAhead}
     */
    source: function(items) {
        if (!this.term.length || !items.length) {
            this.hide();
            return this;
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
                    new Element('li').addClass(Toolkit.options.vendor + 'type-ahead-heading').grab(new Element('span', { text: category }))
                );
            }

            for (var i = 0, a; item = items[i]; i++) {
                if (count >= options.itemLimit) {
                    break;
                }

                a = options.builder(item);
                a.addEvents({
                    mouseover: this.rewind,
                    click: this.onSelect.pass(results.length, this)
                });

                elements.push( new Element('li').grab(a) );
                results.push(item);
                count++;
            }

            elements.inject(list);
        }.bind(this));

        // Append list
        if (options.contentElement) {
            this.element.getElement(options.contentElement).empty().grab(list);
        } else {
            this.element.empty().grab(list);
        }

        // Set the current result set to the items list
        // This will be used for index cycling
        this.items = results;

        // Cache the result set to the term
        // Filter out null categories so that we can re-use the cache
        this.cache[this.term.toLowerCase()] = results.filter(function(item) {
            return (item !== null);
        });

        this.fireEvent('load');

        // Apply the shadow text
        this._shadow();

        // Position the list
        this.position();

        this.fireEvent('show');

        return this;
    },

    /**
     * Monitor the current input term to determine the shadow text.
     * Shadow text will reference the term cache.
     *
     * @private
     * @returns {Toolkit.TypeAhead}
     */
    _shadow: function() {
        if (!this.shadow) {
            return this;
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

        return this;
    }.protect(),

    /**
     * Cycle through the items in the list when an arrow key, esc or enter is released.
     *
     * @private
     * @param {DOMEvent} e
     */
    onCycle: function(e) {
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
                e.preventDefault();

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
        this.select(this.index, 'cycle');
    },

    /**
     * Event handler called for a lookup.
     *
     * @private
     */
    onFind: function() {
        var term = this.term,
            options = this.options,
            sourceType = typeOf(options.source);

        // Check the cache first
        if (this.cache[term.toLowerCase()]) {
            this.source(this.cache[term.toLowerCase()]);

            // Use the response of an AJAX request
        } else if (sourceType === 'string') {
            var url = options.source,
                cache = this.getCache(url);

            if (cache) {
                this.source(cache);
            } else {
                var query = options.query;
                query.term = term;

                new Request.JSON({
                    url: url,
                    data: query,
                    onSuccess: this.source
                }).get();
            }
            // Use a literal array list
        } else if (sourceType === 'array') {
            this.source(options.source);

            // Use the return of a function
        } else if (sourceType === 'function') {
            var response = options.source.attempt([], this);

            if (response) {
                this.source(response);
            }
        } else {
            throw new Error('Invalid TypeAhead source type');
        }
    },

    /**
     * Lookup items based on the current input value.
     *
     * @private
     * @param {DOMEvent} e
     */
    onLookup: function(e) {
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
     * Event handler to select an item from the list.
     *
     * @private
     * @param {Number} index
     */
    onSelect: function(index) {
        this.select(index);
        this.hide();
    }

});

    /**
     * Defines a component that can be instantiated through typeAhead().
     */
    Toolkit.createComponent('typeAhead', function(options) {
        return new Toolkit.TypeAhead(this, options);
    });

})();