/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './template-component',
    '../events/clickout',
    '../extensions/shown-selector',
    '../extensions/to-string'
], function($, Toolkit, TemplateComponent) {

var TypeAhead = Toolkit.TypeAhead = TemplateComponent.extend({
    name: 'TypeAhead',
    version: '2.1.3',

    /** Current index in the drop menu while cycling. */
    index: -1,

    /** The input field to listen against. */
    input: null,

    /** List of item data to render in the drop menu. */
    items: [],

    /** The shadow input field. */
    shadow: null,

    /** Current term in the input field to match against. */
    term: '',

    /** Lookup throttle timer. */
    timer: null,

    /** The element that wraps the input when `shadow` is enabled. */
    wrapper: null,

    /**
     * Initialize the type ahead.
     *
     * @param {jQuery} input
     * @param {Object} [options]
     */
    constructor: function(input, options) {
        input = $(input);

        if (input.prop('tagName').toLowerCase() !== 'input') {
            throw new Error('TypeAhead must be initialized on an input field');
        }

        var self = this;

        options = this.setOptions(options, input);
        this.element = this.createElement()
            .attr('role', 'listbox')
            .aria('multiselectable', false);

        // The input field to listen against
        this.input = input;

        // Use default callbacks
        $.each({ sorter: 'sort', matcher: 'match', builder: 'build' }, function(key, fn) {
            if (options[key] === false) {
                return;
            }

            var callback;

            if (options[key] === null || $.type(options[key]) !== 'function') {
                callback = self[fn];
            } else {
                callback = options[key];
            }

            options[key] = callback.bind(self);
        });

        // Prefetch source data from URL
        if (options.prefetch && $.type(options.source) === 'string') {
            var url = options.source;

            $.getJSON(url, options.query, function(items) {
                self.cache[url] = items;
            });
        }

        // Enable shadow inputs
        if (options.shadow) {
            this.wrapper = this.render(this.options.shadowTemplate);

            this.shadow = this.input.clone()
                .addClass('is-shadow')
                .removeAttr('id')
                .prop('readonly', true)
                .aria('readonly', true);

            this.input
                .addClass('not-shadow')
                .replaceWith(this.wrapper);

            this.wrapper
                .append(this.shadow)
                .append(this.input);
        }

        // Set ARIA after shadow so that attributes are not inherited
        input
            .attr({
                autocomplete: 'off',
                autocapitalize: 'off',
                autocorrect: 'off',
                spellcheck: 'false',
                role: 'combobox'
            })
            .aria({
                autocomplete: 'list',
                owns: this.element.attr('id'),
                expanded: false
            });

        // Initialize events
        this.addEvents([
            ['keyup', 'input', 'onLookup'],
            ['keydown', 'input', 'onCycle'],
            ['clickout', 'element', 'hide'],
            ['resize', 'window', $.debounce(this.onHide.bind(this))]
        ]);

        this.initialize();
    },

    /**
     * Remove the shadow before destroying.
     */
    destructor: function() {
        if (this.shadow) {
            this.shadow.parent().replaceWith(this.input);
            this.input.removeClass('not-shadow');
        }
    },

    /**
     * Build the anchor link that will be used in the list.
     *
     * @param {Object} item
     * @returns {jQuery}
     */
    build: function(item) {
        var a = $('<a/>', {
            href: 'javascript:;',
            role: 'option',
            'aria-selected': 'false'
        });

        a.append( this.render(this.options.titleTemplate).html(this.highlight(item.title)) );

        if (item.description) {
            a.append( this.render(this.options.descTemplate).html(item.description) );
        }

        return a;
    },

    /**
     * Hide the list and reset shadow.
     */
    hide: function() {
        this.fireEvent('hiding');

        if (this.shadow) {
            this.shadow.val('');
        }

        this.input.aria('expanded', false);
        this.element.conceal();

        this.fireEvent('hidden');
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
            options = this.options,
            callback = function(match) {
                return this.render(options.highlightTemplate).html(match).toString();
            }.bind(this);

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
        this.timer = setTimeout(this.onFind.bind(this), this.options.throttle);
    },

    /**
     * Match an item if it contains the term.
     *
     * @param {Object} item
     * @param {String} term
     * @returns {bool}
     */
    match: function(item, term) {
        return (item.title.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    },

    /**
     * Position the menu below the input.
     */
    position: function() {
        if (!this.items.length) {
            this.hide();
            return;
        }

        this.fireEvent('showing');

        var iPos = this.input.offset();

        this.element
            .css('top', iPos.top + this.input.outerHeight())
            .css(Toolkit.isRTL ? 'right' : 'left', iPos.left)
            .reveal();

        this.input.aria('expanded', true);

        this.fireEvent('shown');
    },

    /**
     * Rewind the cycle pointer to the beginning.
     */
    rewind: function() {
        this.index = -1;
        this.element.find('li').removeClass('is-active');
    },

    /**
     * Select an item in the list.
     *
     * @param {Number} index
     * @param {String} [event]
     */
    select: function(index, event) {
        this.index = index;

        var rows = this.element.find('li');

        rows
            .removeClass('is-active')
            .find('a')
                .aria('selected', false);

        // Select
        if (index >= 0) {
            if (this.items[index]) {
                var item = this.items[index];

                rows.eq(index)
                    .addClass('is-active')
                    .find('a')
                        .aria('selected', true);

                this.input.val(item.title);

                this.fireEvent(event || 'select', [item, index]);
            }

        // Reset
        } else {
            this.input.val(this.term);

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
     * Process the list of items be generating new elements and positioning below the input.
     *
     * @param {Array} items
     */
    source: function(items) {
        if (!this.term.length || !items.length) {
            this.hide();
            return;
        }

        var options = this.options,
            term = this.term,
            categories = { _empty_: [] },
            item,
            list = $('<ul/>');

        // Reset
        this.items = [];
        this.index = -1;

        // Sort and match the list of items
        if ($.type(options.sorter) === 'function') {
            items = options.sorter(items);
        }

        if ($.type(options.matcher) === 'function') {
            items = items.filter(function(item) {
                return options.matcher(item, term);
            });
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

        $.each(categories, function(category, items) {
            var elements = [];

            if (category !== '_empty_') {
                results.push(null);

                elements.push(
                    this.render(options.headingTemplate).append( $('<span/>', { text: category }) )
                );
            }

            for (var i = 0, a; item = items[i]; i++) {
                if (count >= options.itemLimit) {
                    break;
                }

                a = options.builder(item);
                a.on({
                    mouseover: this.rewind.bind(this),
                    click: $.proxy(this.onSelect, this, results.length)
                });

                elements.push( $('<li/>').append(a) );
                results.push(item);
                count++;
            }

            list.append(elements);
        }.bind(this));

        // Append list
        this.element.empty().append(list);

        // Set the current result set to the items list
        // This will be used for index cycling
        this.items = results;

        // Cache the result set to the term
        // Filter out null categories so that we can re-use the cache
        this.cache[term.toLowerCase()] = results.filter(function(item) {
            return (item !== null);
        });

        this.fireEvent('load');

        // Apply the shadow text
        this._shadow();

        // Position the list
        this.position();
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

        var term = this.input.val(),
            termLower = term.toLowerCase(),
            value = '';

        if (this.cache[termLower] && this.cache[termLower][0]) {
            var title = this.cache[termLower][0].title;

            if (title.toLowerCase().indexOf(termLower) === 0) {
                value = term + title.substr(term.length, (title.length - term.length));
            }
        }

        this.shadow.val(value);
    },

    /**
     * Cycle through the items in the list when an arrow key, esc or enter is released.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onCycle: function(e) {
        var items = this.items,
            length = Math.min(this.options.itemLimit, Math.max(0, items.length)),
            event = 'cycle';

        if (!length || !this.element.is(':shown')) {
            return;
        }

        switch (e.keyCode) {
            // Cycle upwards (up)
            case 38:
                this.index -= (items[this.index - 1] ? 1 : 2); // category check

                if (this.index < 0) {
                    this.index = length;
                }
            break;

            // Cycle downwards (down)
            case 40:
                this.index += (items[this.index + 1] ? 1 : 2); // category check

                if (this.index >= length) {
                    this.index = -1;
                }
            break;

            // Select first (tab)
            case 9:
                e.preventDefault();

                var i = 0;

                while (!this.items[i]) {
                    i++;
                }

                event = 'select';
                this.index = i;
                this.hide();
            break;

            // Select current index (enter)
            case 13:
                e.preventDefault();

                event = 'select';
                this.hide();
            break;

            // Reset (esc)
            case 27:
                this.index = -1;
                this.hide();
            break;

            // Cancel others
            default:
            return;
        }

        if (this.shadow) {
            this.shadow.val('');
        }

        // Select the item
        this.select(this.index, event);
    },

    /**
     * Event handler called for a lookup.
     */
    onFind: function() {
        var term = this.term,
            options = this.options,
            sourceType = $.type(options.source);

        // Check the cache first
        if (this.cache[term.toLowerCase()]) {
            this.source(this.cache[term.toLowerCase()]);

        // Use the response of an AJAX request
        } else if (sourceType === 'string') {
            var url = options.source,
                cache = this.cache[url];

            if (cache) {
                this.source(cache);
            } else {
                var query = options.query;
                query.term = term;

                $.getJSON(url, query, this.source.bind(this));
            }

        // Use a literal array list
        } else if (sourceType === 'array') {
            this.source(options.source);

        // Use the return of a function
        } else if (sourceType === 'function') {
            var response = options.source.call(this);

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
     * @param {jQuery.Event} e
     */
    onLookup: function(e) {
        if ($.inArray(e.keyCode, [38, 40, 27, 9, 13]) >= 0) {
            return; // Handle with onCycle()
        }

        clearTimeout(this.timer);

        var term = this.input.val().trim();

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

}, {
    source: [],
    minLength: 1,
    itemLimit: 15,
    throttle: 250,
    prefetch: false,
    shadow: false,
    query: {},
    template: function(bem) {
        return '<div class="' + bem('type-ahead') + '"></div>';
    },
    shadowTemplate: function(bem) {
        return '<div class="' + bem('type-ahead', 'shadow') + '"></div>';
    },
    titleTemplate: function(bem) {
        return '<span class="' + bem('type-ahead', 'title') + '"></span>';
    },
    descTemplate: function(bem) {
        return '<span class="' + bem('type-ahead', 'desc') + '"></span>';
    },
    highlightTemplate: function(bem) {
        return '<mark class="' + bem('type-ahead', 'highlight') + '"></mark>';
    },
    headingTemplate: function(bem) {
        return '<li class="' + bem('type-ahead', 'heading') + '"></li>';
    },

    // Callbacks
    sorter: null,
    matcher: null,
    builder: null
});

Toolkit.createPlugin('typeAhead', function(options) {
    return new TypeAhead(this, options);
});

return TypeAhead;
});
