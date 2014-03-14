/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

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
        navElement: '.tabs-nav',
        sectionElement: '.tabs-section',
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
        this.nav = element.getElement(options.navElement);

        this.tabs = this.nav.getElements('ul > li > a');
        this.tabs.each(function(tab, index) {
            tab.set('data-index', index).removeClass(Toolkit.options.isPrefix + 'active');
        });

        this.sections = element.getElements(options.sectionElement);
        this.sections.conceal();

        // Set events
        this.events[options.mode + ' tabs'] = 'onShow';

        if (options.mode !== 'click' && options.preventDefault) {
            this.events['click tabs'] = function(e) {
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
            isPrefix = Toolkit.options.isPrefix,
            ajax = this.readOption(tab, 'ajax'),
            url = this.readValue(tab, this.readOption(tab, 'getUrl'));

        // Load content with AJAX
        if (ajax && url && url.substr(0, 1) !== '#' && !this.cache[url]) {
            this.requestData(
                url,
                function() {
                    section.set('html', this._loadingTemplate())
                        .addClass(isPrefix + 'loading');
                }.bind(this),

                function(response) {
                    this.cache[url] = true;

                    this.fireEvent('load', response);

                    section.set('html', response)
                        .removeClass(isPrefix + 'loading');
                }.bind(this),

                function() {
                    section.set('html', this._errorTemplate())
                        .removeClass(isPrefix + 'loading')
                        .addClass(Toolkit.options.hasPrefix + 'failed');
                }.bind(this)
            );
        }

        // Toggle tabs
        this.nav.getElements('ul > li').removeClass(isPrefix + 'active');

        // Toggle sections
        if (index === this.index && options.collapsible) {
            if (section.isVisible()) {
                section.conceal();

            } else {
                tab.getParent().addClass(isPrefix + 'active');
                section.reveal();
            }
        } else {
            this.hide();

            tab.getParent().addClass(isPrefix + 'active');
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
     */
    onShow: function(e) {
        if (this.options.preventDefault || (this.options.ajax && e.target.get('href').substr(0, 1) !== '#')) {
            e.preventDefault();
        }

        this.show(e.target);
    }

});

    /**
     * Defines a component that can be instantiated through tabs().
     */
    Toolkit.createComponent('tabs', function(options) {
        return new Toolkit.Tabs(this, options);
    });

})();