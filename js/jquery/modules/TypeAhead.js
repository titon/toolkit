/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.TypeAhead = function(input, options) {

    /** Custom options */
    this.options = Titon.setOptions($.fn.typeAhead.options, options);

    /** Primary DOM wrapper */
    this.element = Titon.createElement(this.options);

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
            this.wrapper = $('<div/>').addClass(options.shadowElement.substr(1));
            this.input.wrap(this.wrapper);

            this.shadow = this.input.clone()
                .addClass('is-shadow')
                .prop('readonly', true)
                .appendTo(this.node);

            this.input.addClass('not-shadow');
        }

        // Set events
        $(window).on('keydown', function(e) {
            if (e.key === 'esc' && this.element.is(':shown')) {
                this.hide();
            }
        }.bind(this));

        this.disable().enable();
    };

    this.enable = function() {
        this.input.on({
            keyup: this._lookup.bind(this),
            keydown: this._cycle.bind(this)
        });

        return this;
    };

    this.disable = function() {
        this.input.off({
            keyup: this._lookup.bind(this),
            keydown: this._cycle.bind(this)
        });

        return this;
    };

    this.build = function(item) {
        var a = $('<a/>', {
            href: 'javascript:;'
        });

        a.append( $('<span/>', {
            'class': this.options.titleElement,
            html: this.highlight(item.title)
        }) );

        if (item.description) {
            a.append( $('<span/>', {
                'class': this.options.descElement,
                html: item.description
            }) );
        }

        return a;
    };

    this.hide = function() {
        if (this.shadow) {
            this.shadow.val('');
        }

        if (this.element.is(':shown')) {
            this.element.conceal();
        }

        return this;
    };

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

    this.match = function(item, term) {
        return (item.toLowerCase().indexOf(term.toLowerCase()) >= 0);
    };

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
                    $('<li/>').addClass('heading').append( $('<span/>', { text: category }) )
                );
            }

            for (var i = 0, a; item = items[i]; i++) {
                if (count >= options.itemLimit) {
                    break;
                }

                a = options.builder(item);
                a.on({
                    mouseover: this.rewind,
                    click: (function(length) {
                        return this._select(length);
                    }.bind(this))(results.length)
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

        // Apply the shadow text
        this._shadow();

        // Position the list
        this._position();

        return this;
    };

    this.rewind = function() {
        this.index = -1;
        this.element.find('li').removeClass('is-active');

        return this;
    };

    this.select = function(index) {
        this.index = index;

        var rows = this.element.find('li');

        rows.removeClass('is-active');

        // Select
        if (index >= 0) {
            if (this.items[index]) {
                var item = this.items[index];

                $(rows[index]).addClass('is-active');

                this.input.val(item.title);
            }
        // Reset
        } else {
            this.input.val(this.term);
        }

        return this;
    };

    this.sort = function(items) {
        return items.sort(function(a, b) {
            return a.title.localeCompare(b.title);
        });
    };

    this._cycle = function(e) {
        var items = this.items,
            length = Math.min(this.options.itemLimit, Math.max(0, items.length))

        if (!length || !this.element.is(':shown')) {
            return;
        }

        switch (e.key.toLowerCase()) {
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
            this.shadow.val('');
        }

        // Select the item
        this.select(this.index);
    };

    this._lookup = function(e) {
        if ($.inArray(e.key.toLowerCase(), ['up', 'down', 'esc', 'tab', 'enter']) >= 0) {
            return; // Handle with _cycle()
        }

        window.clearTimeout(this.timer);

        var term = this.input.val().trim();

        if (term.length < this.options.minLength) {
            this.hide();

        } else {
            this._shadow();
            this.lookup(term);
        }
    };

    this._position = function() {
        if (!this.items.length) {
            this.hide();
            return;
        }

        var iPos = this.input.offset();

        this.element.css({
            left: iPos.left,
            top: (iPos.top + this.input.outerHeight())
        }).reveal();
    };

    this._select = function(index) {
        this.select(index);
        this.hide();
    };

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

    // Initialize the class only if the element exists
    if (this.input.length) {
        this.initialize();
    }
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
 * @returns {Titon.TypeAhead}
 */
$.fn.typeAhead = function(options) {
    return this.each(function() {
        if (this.$typeAhead) {
            return this.$typeAhead;
        }

        this.$typeAhead = new Titon.TypeAhead(this, options);

        return this.$typeAhead;
    });
};

$.fn.typeAhead.options = {
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
    titleElement: '.type-ahead-title',
    descElement: '.type-ahead-desc',
    shadowElement: '.type-ahead-shadow',
    template: '<div class="type-ahead"></div>',

    // Callbacks
    sorter: null,
    matcher: null,
    builder: null
};

})(jQuery);