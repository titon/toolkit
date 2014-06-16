define([
    './component',
    '../extensions/bound',
    '../extensions/shown-selector'
], function(Toolkit) {

Toolkit.Tab = Toolkit.Component.extend({
    name: 'Tab',
    version: '1.4.0',

    /** Index of the section currently displayed. */
    index: 0,

    /** Navigation element that contains the tabs. */
    nav: null,

    /** Collection of sections to toggle. */
    sections: [],

    /** Collection of tabs to trigger toggle. */
    tabs: [],

    /**
     * Initialize the tab.
     *
     * @param {jQuery} element
     * @param {Object} [options]
     */
    constructor: function(element, options) {
        var sections, tabs, self = this, vendor = Toolkit.vendor;

        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);

        // Determine cookie name
        if (!options.cookie) {
            options.cookie = element.attr('id');
        }

        // Find all the sections and set ARIA attributes
        this.sections = sections = element.find('.' + vendor + 'tab-section').each(function(index, section) {
            section = $(section);
            section
                .attr('role', 'tabpanel')
                .attr('id', section.attr('id') || self.id('section', index))
                .aria('labelledby', self.id('tab', index))
                .conceal();
        });

        // Find the nav and set ARIA attributes
        this.nav = element.find('.' + vendor + 'tab-nav')
            .attr('role', 'tablist');

        // Find the tabs within the nav and set ARIA attributes
        this.tabs = tabs = this.nav.find('a').each(function(index) {
            $(this)
                .data('index', index)
                .attr({
                    role: 'tab',
                    id: self.id('tab', index)
                })
                .aria({
                    controls: sections.eq(index).attr('id'),
                    selected: false,
                    expanded: false
                })
                .removeClass('is-active');
        });

        // Initialize events
        this.events = {
            '{mode} element .@tab-nav a': 'onShow'
        };

        if (options.mode !== 'click' && options.preventDefault) {
            this.events['click element .@tab-nav a'] = function(e) {
                e.preventDefault();
            };
        }

        this.initialize();

        // Trigger default tab to display
        var index = options.defaultIndex;

        if (options.persistState && options.cookie && $.cookie) {
            index = $.cookie('toolkit.tab.' + options.cookie);
        }

        if (!index && options.loadFragment && location.hash) {
            index = tabs.filter(function() {
                return ($(this).attr('href') === location.hash);
            }).eq(0).data('index');
        }

        if (!index || !tabs[index]) {
            index = options.defaultIndex;
        }

        this.jump(index);
    },

    /**
     * Reveal the last section when destroying.
     */
    destructor: function() {
        this.sections.eq(this.index).reveal();
    },

    /**
     * Hide all sections.
     */
    hide: function() {
        this.sections.conceal();

        this.fireEvent('hide', [this.node]);
    },

    /**
     * Jump to a specific tab via index.
     *
     * @param {Number} index
     */
    jump: function(index) {
        this.show(this.tabs[$.bound(index, this.tabs.length)]);
    },

    /**
     * Show the content based on the tab. Can either pass an integer as the index in the collection,
     * or pass an element object for a tab in the collection.
     *
     * @param {jQuery} tab
     */
    show: function(tab) {
        tab = $(tab);

        var index = tab.data('index'),
            section = this.sections.eq(index),
            options = this.options,
            ajax = this.readOption(tab, 'ajax'),
            url = this.readValue(tab, this.readOption(tab, 'getUrl'));

        // Load content with AJAX
        if (ajax && url && url.substr(0, 1) !== '#' && !this.cache[url]) {
            this.requestData(url,
                function() {
                    section
                        .html(Toolkit.messages.loading)
                        .addClass('is-loading')
                        .aria('busy', true);
                },
                function(response) {
                    if (options.cache) {
                        this.cache[url] = true;
                    }

                    this.fireEvent('load', [response]);

                    section
                        .html(response)
                        .removeClass('is-loading')
                        .aria('busy', false);
                },
                function() {
                    section
                        .html(Toolkit.messages.error)
                        .removeClass('is-loading')
                        .addClass('has-failed')
                        .aria('busy', false);
                }
            );
        }

        // Toggle tabs
        this.tabs
            .aria('toggled', false)
            .parent().removeClass('is-active');

        // Toggle sections
        if (index === this.index && options.collapsible) {
            if (section.is(':shown')) {
                section.conceal();

            } else {
                tab.aria('toggled', true).parent().addClass('is-active');
                section.reveal();
            }
        } else {
            this.hide();

            tab.aria('toggled', true).parent().addClass('is-active');
            section.reveal();
        }

        // Persist the state using a cookie
        if (options.persistState && $.cookie) {
            $.cookie('toolkit.tab.' + options.cookie, index, {
                expires: options.cookieDuration
            });
        }

        this.index = index;
        this.node = tab;

        this.fireEvent('show', [tab]);
    },

    /**
     * Event callback for tab element click.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        if (this.options.preventDefault || (this.options.ajax && e.currentTarget.getAttribute('href').substr(0, 1) !== '#')) {
            e.preventDefault();
        }

        this.show(e.currentTarget);
    }

}, {
    mode: 'click',
    ajax: true,
    collapsible: false,
    defaultIndex: 0,
    persistState: false,
    preventDefault: true,
    loadFragment: true,
    cookie: null,
    cookieDuration: 30,
    getUrl: 'href'
});

Toolkit.create('tab', function(options) {
    return new Toolkit.Tab(this, options);
});

return Toolkit;
});