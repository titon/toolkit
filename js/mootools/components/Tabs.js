/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Tabs = new Class({
    Extends: Toolkit.Component,

    /** Navigation container */
    nav: null,

    /** Collection of content sections */
    sections: [],

    /** Collection of tabs (anchor links) */
    tabs: [],

    /** The current index */
    index: 0,

    /** Default options */
    options: {
        ajax: true,
        collapsible: false,
        defaultIndex: 0,
        persistState: false,
        preventDefault: true,
        loadFragment: true,
        cookie: null,
        cookieDuration: 30,
        getUrl: 'href',
        template: false
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        this.parent(options);
        this.element = element;
        this.options = options = this.inheritOptions(this.options, element);

        if (!options.cookie) {
            options.cookie = element.get('id');
        }

        // Get elements
        this.sections = element.getElements('.' + vendor + 'tabs-section').each(function(section, index) {
            section
                .set('role', 'tabpanel')
                .set('id', section.get('id') || this.id('section', index))
                .aria('labelledby', this.id('tab', index))
                .conceal();
        }.bind(this));

        this.nav = element.getElement('.' + vendor + 'tabs-nav').set('role', 'tablist');

        this.tabs = this.nav.getElements('a').each(function(tab, index) {
            tab
                .set({
                    'data-index': index,
                    role: 'tab',
                    id: this.id('tab', index)
                })
                .aria({
                    controls: this.sections[index].get('id'),
                    selected: false,
                    expanded: false
                })
                .removeClass('is-active');
        }.bind(this));

        // Set events
        this.events = {};
        this.events['{mode} element .@tabs-nav a'] = 'onShow';

        if (options.mode !== 'click' && options.preventDefault) {
            this.events['click element .@tabs-nav a'] = function(e) {
                e.preventDefault();
            };
        }

        this.enable();
        this.fireEvent('init');

        // Trigger default tab to display
        var index = options.defaultIndex;

        if (options.persistState) {
            index = Number.from(Cookie.read('toolkit.tabs.' + options.cookie));
        }

        if (!index && options.loadFragment && location.hash) {
            var tab = this.tabs.filter(function(el) {
                return (el.get('href') === location.hash);
            });

            if (tab[0]) {
                index = tab[0].get('data-index');
            }
        }

        if (!index || !this.tabs[index]) {
            index = 0;
        }

        this.jump(index);
    },

    /**
     * Reveal the last section when destroying.
     */
    doDestroy: function() {
        this.sections[this.index].reveal();
    },

    /**
     * Hide all sections and trigger event.
     *
     * @returns {Toolkit.Tabs}
     */
    hide: function() {
        this.sections.conceal();

        this.fireEvent('hide', this.node);

        return this;
    },

    /**
     * Jump to a specific tab via index.
     *
     * @param {Number} index
     * @returns {Toolkit.Tabs}
     */
    jump: function(index) {
        return this.show(this.tabs[Number.from(index).bound(this.tabs.length)]);
    },

    /**
     * Show the content based on the tab. Can either pass an integer as the index in the collection,
     * or pass an element object for a tab in the collection.
     *
     * @param {Element} tab
     * @returns {Toolkit.Tabs}
     */
    show: function(tab) {
        var index = tab.get('data-index'),
            section = this.sections[index],
            options = this.options,
            ajax = this.readOption(tab, 'ajax'),
            url = this.readValue(tab, this.readOption(tab, 'getUrl'));

        // Load content with AJAX
        if (ajax && url && url.substr(0, 1) !== '#' && !this.cache[url]) {
            this.requestData(
                url,
                function() {
                    section
                        .set('html', Toolkit.messages.loading)
                        .addClass('is-loading')
                        .aria('busy', true);
                }.bind(this),

                function(response) {
                    if (options.cache) {
                        this.cache[url] = true;
                    }

                    this.fireEvent('load', response);

                    section
                        .set('html', response)
                        .removeClass('is-loading')
                        .aria('busy', false);
                }.bind(this),

                function() {
                    section
                        .set('html', Toolkit.messages.error)
                        .removeClass('is-loading')
                        .addClass('has-failed')
                        .aria('busy', false);
                }.bind(this)
            );
        }

        // Toggle tabs
        this.tabs
            .aria({ selected: false, expanded: false })
            .getParent().removeClass('is-active');

        // Toggle sections
        if (index === this.index && options.collapsible) {
            if (section.isVisible()) {
                section.conceal();

            } else {
                tab.aria({ selected: true, expanded: true }).getParent().addClass('is-active');
                section.reveal();
            }
        } else {
            this.hide();

            tab.aria({ selected: true, expanded: true }).getParent().addClass('is-active');
            section.reveal();
        }

        // Persist the state using a cookie
        if (options.persistState) {
            Cookie.write('toolkit.tabs.' + options.cookie, index, {
                duration: options.cookieDuration
            });
        }

        this.index = index;
        this.node = tab;

        this.fireEvent('show', tab);

        return this;
    },

    /**
     * Event callback for tab element click.
     *
     * @private
     * @param {DOMEvent} e
     * @param {Element} node
     */
    onShow: function(e, node) {
        if (this.options.preventDefault || (this.options.ajax && e.target.get('href').substr(0, 1) !== '#')) {
            e.preventDefault();
        }

        this.show(node);
    }

});

Toolkit.create('tabs', function(options) {
    return new Toolkit.Tabs(this, options);
});