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

    /** The current and previous shown indices */
    previousIndex: 0,
    currentIndex: 0,

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
        sectionsElement: '.tabs-section',
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
        this.setElement(element);

        if (!this.element) {
            return;
        }

        if (!this.options.cookie) {
            this.options.cookie = this.element.get('id');
        }

        options = this.options;

        // Get elements
        this.nav = this.element.getElement(options.navElement);

        this.tabs = this.nav.getElements('ul > li > a');
        this.tabs.each(function(tab, index) {
            tab.set('data-index', index).removeClass(Toolkit.options.isPrefix + 'active');
        });

        this.sections = this.element.getElements(options.sectionsElement);
        this.sections.conceal();

        // Set events
        this.bindEvents();
        this.fireEvent('init');

        // Trigger default tab to display
        var index = options.defaultIndex;

        if (options.persistState) {
            index = Number.from(Cookie.read('toolkit.tabs.' + options.cookie) || options.defaultIndex);

        } else if (options.loadFragment && location.hash) {
            var tab = this.tabs.filter(function(el) {
                return (el.get('href') === location.hash);
            });

            if (tab[0]) {
                index = tab[0].get('data-index');
            }
        }

        if (!this.tabs[index]) {
            index = 0;
        }

        this.jump(index);
    },

    /**
     * Add events for tab click events.
     *
     * @returns {Toolkit.Tabs}
     */
    bindEvents: function() {
        this.tabs.addEvent(this.options.mode, this.__show);

        if (this.options.mode !== 'click' && this.options.preventDefault) {
            this.tabs.addEvent('click', function(e) {
                e.preventDefault();
            });
        }

        return this;
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
        if (this.tabs[index]) {
            this.show(this.tabs[index]);
        }

        return this;
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
            url = this.readValue(tab, options.getUrl);

        // Load content with AJAX
        if (options.ajax && url && url.substr(0, 1) !== '#' && !this.cache[url]) {
            this.requestData(
                url,
                function() {
                    section.set('html', this._loadingTemplate())
                        .addClass(isPrefix + 'loading');
                }.bind(this),

                function(response) {
                    this.cache[url] = true;

                    section.set('html', response)
                        .removeClass(isPrefix + 'loading');

                    this.fireEvent('load', response);
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
        if (index === this.currentIndex && options.collapsible) {
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

        // Track
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;

        this.fireEvent('show', tab);

        // Set current node
        this.node = tab;

        return this;
    },

    /**
     * Event callback for tab element click.
     *
     * @private
     * @param {DOMEvent} e
     */
    __show: function(e) {
        if (this.options.preventDefault || (this.options.ajax && e.target.get('href').substr(0, 1) !== '#')) {
            e.preventDefault();
        }

        if (!this.enabled) {
            return;
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