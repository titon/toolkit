/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.TypeAhead = Toolkit.Component.create(function(input, options) {

    /** Custom options */
    this.options = this.setOptions(Toolkit.TypeAhead.options, options);

    /** Primary DOM wrapper */
    this.element = this.createElement(this.options);

    /** Input element to display menu against */
    this.input = $(input);

    /** Shadow input element */
    this.shadow = null;

    /** Current active index when cycling through the list */
    this.index = -1;

    /** List of items to display and match against */
    this.items = [];

    /** Current term used during lookup and matching */
    this.term = '';

    /** Throttle timer */
    this.timer = null;

    /** Cached queries */
    this.cache = {};

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        if (this.input.prop('tagName').toLowerCase() !== 'input') {
            throw new Error('TypeAhead must be initialized on an input field');
        } else {
            this.input.attr('autocomplete', 'off');
        }

        // Setup state
        var options = this.options;

        // Use default callbacks
        $.each({ sorter: 'sort', matcher: 'match', builder: 'build' }, function(key, fn) {
            if (options[key] === false) {
                return;
            }

            var callback;

            if (options[key] === null || $.type(options[key]) !== 'function') {
                callback = this[fn];
            } else {
                callback = options[key];
            }

            this.options[key] = callback.bind(this);
        }.bind(this));

        // Prefetch source from URL
        if (options.prefetch && $.type(options.source) === 'string') {
            var url = options.source;

            $.ajax({
                url: url,
                data: options.query,
                dataType: 'json',
                success: function(items) {
                    this.cache[url] = items;
                }.bind(this)
            });
        }

        // Enable shadow inputs
        if (options.shadow) {
            this.wrapper = $('<div/>').addClass('type-ahead-shadow');

            this.shadow = this.input.clone()
                .addClass('is-shadow')
                .removeAttr('id')
                .prop('readonly', true);

            // wrap() didn't seem to work correctly
            this.input.addClass('not-shadow').replaceWith(this.wrapper);
            this.wrapper.append(this.input).append(this.shadow);
        }

        // Set events
        this.input.on({
            keyup: this.__lookup.bind(this),
            keydown: this.__cycle.bind(this)
        });

        $(window).on('keydown', function(e) {
            if (e.keyCode === 27 /*esc*/ && this.element.is(':shown')) {
                this.hide();
            }
        }.bind(this));

        this.fireEvent('init');
    };

    /**
     * Build the anchor link that will be used in the list.
     *
     * @param {Object} item
     * @returns {jQuery}
     */
    this.build = function(item) {
        var a = $('<a/>', {
            href: 'javascript:;'
        });

        a.append( $('<span/>', {
            'class': 'type-ahead-title',
            html: this.highlight(item.title)
        }) );

        if (item.description) {
            a.append( $('<span/>', {
                'class': 'type-ahead-desc',
                html: item.description
            }) );
        }

        return a;
    };

    /**
     * Hide the list and reset shadow.
     *
     * @returns {Toolkit.TypeAhead}
     */
    this.hide = function() {
        if (this.shadow) {
            this.shadow.val('');
        }

        if (this.element.is(':shown')) {
            this.element.conceal();
            this.fireEvent('hide');
        }

        return this;
    };

    /**
     * Highlight the current term within the item string.
     * Split multi-word terms to highlight separately.
     *
     * @param {String} item
     * @returns {String}
     */
    this.highlight = function(item) {
        var terms = this.term.replace(/[\-\[\]\{\}()*+?.,\\^$|#]/g, '\\$&').split(' '),
            callback = function(match) {
                return '<span class="type-ahead-highlight">' + match + '</span>';
            };

        for (var i = 0, t; t = terms[i]; i++) {
            item = item.replace(new RegExp(t, 'ig'), callback);
        }

        return item;
    };

    /**
     * Load the list of items to use for look ups.
     * Trigger different actions depending on the type of source.
     *
     * @param {String} term
     * @returns {Toolkit.TypeAhead}
     */
    this.lookup = function(term) {
        this.term = term;
        this.timer = window.setTimeout(function() {
            var options = this.options,
                sourceType = $.type(options.source);

            // Check the cache first
            if (this.cache[term.toLowerCase()]) {
                this.process(this.cache[term.toLowerCase()]);

            // Use the response of an AJAX request
            } else if (sourceType === 'string') {
                var url = options.source,
                    cache = this.cache[url];

                if (cache) {
                    this.process(cache);
                } else {
                    var query = options.query;
                        query.term = term;

                    $.ajax({
                        url: url,
                        data: query,
                        dataType: 'json',
                        success: this.process.bind(this)
                    });
                }
            // Use a literal array list
            } else if (sourceType === 'array') {
                this.process(options.source);

            // Use the return of a function
            } else if (sourceType === 'function') {
                var response = options.source.call(this);

                if (response) {
                    this.process(response);
                }
            } else {
                throw new Error('Invalid TypeAhead source type');
            }
        }.bind(this), this.options.throttle);

        return this;
    };

    /**
     * Match an item if it contains the term.
     *
     * @param {String} item
     * @param {String} term
     * @returns {bool}
     */
    this.match = function(item, term) {
        return (item.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    };

    /**
     * Position the menu below the input.
     *
     * @returns {Toolkit.TypeAhead}
     */
    this.position = function() {
        if (!this.items.length) {
            return this.hide();
        }

        var iPos = this.input.offset();

        this.element.css({
            left: iPos.left,
            top: (iPos.top + this.input.outerHeight())
        }).reveal();

        return this;
    };

    /**
     * Process the list of items be generating new elements and positioning below the input.
     *
     * @param {Array} items
     * @returns {Toolkit.TypeAhead}
     */
    this.process = function(items) {
        if (!this.term.length || !items.length) {
            this.hide();
            return this;
        }

        var options = this.options,
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

        $.each(categories, function(category, items) {
            var elements = [];

            if (category !== '_empty_') {
                results.push(null);

                elements.push(
                    $('<li/>').addClass('type-ahead-heading').append( $('<span/>', { text: category }) )
                );
            }

            for (var i = 0, a; item = items[i]; i++) {
                if (count >= options.itemLimit) {
                    break;
                }

                a = options.builder(item);
                a.on({
                    mouseover: this.rewind.bind(this),
                    click: $.proxy(this.__select, this, results.length)
                });

                elements.push( $('<li/>').append(a) );
                results.push(item);
                count++;
            }

            list.append(elements);
        }.bind(this));

        // Append list
        this.element.empty();

        if (options.contentElement) {
            this.element.find(options.contentElement).append(list);
        } else {
            this.element.append(list);
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
    };

    /**
     * Rewind the cycle pointer to the beginning.
     *
     * @returns {Toolkit.TypeAhead}
     */
    this.rewind = function() {
        this.index = -1;
        this.element.find('li').removeClass('is-active');

        return this;
    };

    /**
     * Select an item in the list.
     *
     * @param {Number} index
     * @returns {Toolkit.TypeAhead}
     */
    this.select = function(index) {
        this.index = index;

        var rows = this.element.find('li');

        rows.removeClass('is-active');

        // Select
        if (index >= 0) {
            if (this.items[index]) {
                var item = this.items[index];

                rows.item(index).addClass('is-active');

                this.input.val(item.title);

                this.fireEvent('select', [item, index]);
            }

        // Reset
        } else {
            this.input.val(this.term);

            this.fireEvent('reset');
        }

        return this;
    };

    /**
     * Sort the items.
     *
     * @param {Array} items
     * @returns {Array}
     */
    this.sort = function(items) {
        return items.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    };

    /**
     * Monitor the current input term to determine the shadow text.
     * Shadow text will reference the term cache.
     *
     * @private
     */
    this._shadow = function() {
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
    };

    /**
     * Cycle through the items in the list when an arrow key, esc or enter is released.
     *
     * @private
     * @param {DOMEvent} e
     */
    this.__cycle = function(e) {
        var items = this.items,
            length = Math.min(this.options.itemLimit, Math.max(0, items.length));

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

                this.index = i;
                this.hide();
            break;

            // Select current index (enter)
            case 13:
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
        this.select(this.index);
    };

    /**
     * Lookup items based on the current input value.
     *
     * @private
     * @param {DOMEvent} e
     */
    this.__lookup = function(e) {
        if ($.inArray(e.keyCode, [38, 40, 27, 9, 13]) >= 0) {
            return; // Handle with _cycle()
        }

        window.clearTimeout(this.timer);

        var term = this.input.val().trim();

        if (term.length < this.options.minLength) {
            this.fireEvent('reset');
            this.hide();

        } else {
            this._shadow();
            this.lookup(term);
        }
    };

    /**
     * Event handler to select an item from the list.
     *
     * @private
     * @param {Number} index
     */
    this.__select = function(index) {
        this.select(index);
        this.hide();
    };

    if (this.input.length) {
        this.initialize();
    }
});

Toolkit.TypeAhead.options = {
    className: '',
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
};

/**
 * Enable a type ahead select system over an input field by calling typeAhead() on an Element.
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('#input-id').typeAhead({
 *         shadow: true
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.typeAhead = function(options) {
    return this.each(function() {
        $(this).addData('toolkit.typeahead', function() {
            return new Toolkit.TypeAhead(this, options);
        });
    });
};

})(jQuery);