/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Tabs = Toolkit.Component.extend(function(element, options) {
    var events, sections, tabs, self = this;

    this.component = 'Tabs';
    this.version = '1.3.0';
    this.element = element = $(element);
    this.options = options = this.setOptions(options, element);

    this.sections = sections = element.find(options.sectionElement).each(function(index, section) {
        section = $(section);
        section
            .attr('role', 'tabpanel')
            .attr('id', section.attr('id') || self.id('section', index))
            .aria('labelledby', self.id('tab', index))
            .conceal();
    });

    this.nav = element.find(options.navElement).attr('role', 'tablist');
    this.tabs = tabs = this.nav.find('ul > li > a').each(function(index) {
        $(this)
            .data('index', index)
            .attr({
                role: 'tab',
                id: self.id('tab', index)
            })
            .aria({
                controls: sections.item(index).attr('id'),
                selected: false,
                expanded: false
            })
            .removeClass('is-active');
    });

    this.index = 0;
    this.cache = {};
    this.events = events = {};

    // Determine cookie name
    if (!options.cookie) {
        options.cookie = element.attr('id');
    }

    // Initialize events
    events[options.mode + ' tabs'] = 'onShow';

    if (options.mode !== 'click' && options.preventDefault) {
        events['click tabs'] = function(e) {
            e.preventDefault();
        };
    }

    this.enable();
    this.fireEvent('init');

    // Trigger default tab to display
    var index = options.defaultIndex;

    if (options.persistState && options.cookie) {
        index = $.cookie('toolkit.tabs.' + options.cookie);
    }

    if (!index && options.loadFragment && location.hash) {
        index = tabs.filter(function() {
            return ($(this).attr('href') === location.hash);
        }).item(0).data('index');
    }

    if (!index || !tabs[index]) {
        index = options.defaultIndex;
    }

    this.jump(index);
}, {

    /**
     * Hide all sections.
     */
    hide: function() {
        this.sections.conceal();

        this.fireEvent('hide', this.node);
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
            section = this.sections.item(index),
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

                    this.fireEvent('load', response);

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
        this.nav.find('ul > li').removeClass('is-active');
        this.tabs.aria('toggled', false);

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
        if (options.persistState) {
            $.cookie('toolkit.tabs.' + options.cookie, index, {
                expires: options.cookieDuration
            });
        }

        this.index = index;
        this.node = tab;

        this.fireEvent('show', tab);
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
    getUrl: 'href',
    navElement: '.tabs-nav',
    sectionElement: '.tabs-section'
});

/**
 * Defines a component that can be instantiated through tabs().
 */
Toolkit.create('tabs', function(options) {
    return new Toolkit.Tabs(this, options);
});