/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Titon.Tabs = new Class({
    Extends: Titon.Component,

    /** Navigation container */
    nav: null,

    /** Collection of content sections */
    sections: [],

    /** Collection of tabs (anchor links) */
    tabs: [],

    /** The current and previous shown indices */
    previousIndex: 0,
    currentIndex: 0,

    /**
     * Default options.
     *
     *    ajax              - (bool) Will load the href as an ajax call when applicable
     *    collapsible       - (bool) Hide the section if the tab is clicked again
     *    defaultIndex      - (int) Index of the tab/section to display by default
     *    persistState      - (bool) Will persist the last tab clicked between page loads
     *    preventDefault    - (bool) Prevent the default action from triggering for tabs
     *    cookie            - (string) The key used in the cookie name
     *    cookieDuration    - (int) The length the cookie will last (in days)
     *    navElement        - (string) The CSS query to that contains the list buttons
     *    sectionsElement   - (string) The CSS query to grab the section elements
     */
    options: {
        ajax: true,
        collapsible: false,
        defaultIndex: 0,
        persistState: false,
        preventDefault: true,
        cookie: null,
        cookieDuration: 30,
        navElement: '.tabs-nav',
        sectionsElement: '.tabs-section',
        template: false
    },

    /**
     * Initialize Tabs by storing the query, gathering the elements and binding events.
     *
     * @param {Element} element
     * @param {Object} [options]
     */
    initialize: function(element, options) {
        options = options || {};
        options.cookie = (options.cookie || element.get('id')).camelCase();

        this.parent(options);
        this.setElement(element);

        if (!this.element) {
            return;
        }

        // Get elements
        this.nav = this.element.getElement(this.options.navElement);

        this.tabs = this.nav.getElements('ul > li > a');
        this.tabs.each(function(tab, index) {
            tab.set('data-index', index).removeClass('is-active');
        });

        this.sections = this.element.getElements(this.options.sectionsElement);
        this.sections.conceal();

        // Set events
        this.disable().enable();

        this.fireEvent('init');

        // Trigger default tab to display
        var index = Number.from(Cookie.read('titon.tabs.' + this.options.cookie) || this.options.defaultIndex);

        this.jump(index);
    },

    /**
     * Hide all sections and trigger event.
     *
     * @returns {Titon.Tabs}
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
     * @returns {Titon.Tabs}
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
     * @returns {Titon.Tabs}
     */
    show: function(tab) {
        var index = tab.get('data-index'),
            section = this.sections[index],
            url = tab.get('href');

        // Load content with AJAX
        if (this.options.ajax && url && !url.contains('#') && !this.cache[url]) {
            new Request({
                url: url,
                method: 'get',
                evalScripts: true,
                onSuccess: function(response) {
                    this.cache[url] = true;

                    section.set('html', response)
                        .removeClass('is-loading');
                }.bind(this),

                onRequest: function() {
                    section.set('html', this._loadingTemplate())
                        .addClass('is-loading');
                }.bind(this),

                onFailure: function() {
                    section.set('html', this._errorTemplate())
                        .removeClass('is-loading')
                        .addClass('has-failed');
                }.bind(this)
            }).get();
        }

        // Toggle tabs
        this.nav.getElements('ul > li').removeClass('is-active');

        // Toggle sections
        if (index === this.currentIndex && this.options.collapsible) {
            if (section.isVisible()) {
                section.conceal();

            } else {
                tab.getParent().addClass('is-active');
                section.reveal();
            }
        } else {
            this.hide();

            tab.getParent().addClass('is-active');
            section.reveal();
        }

        // Persist the state using a cookie
        if (this.options.persistState) {
            Cookie.write('titon.tabs.' + this.options.cookie, index, {
                duration: this.options.cookieDuration
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
    _show: function(e) {
        if (this.options.preventDefault) {
            e.preventDefault();
        }

        this.show(e.target);
    },

    /**
     * Toggle activation events on and off.
     *
     * @private
     * @param {bool} on
     * @returns {Titon.Tabs}
     */
    _toggleEvents: function(on) {
        if (!this.element) {
            return this;
        }

        var event = (this.options.mode === 'click') ? 'click' : 'mouseover';

        if (on) {
            this.tabs.addEvent(event, this._show);
        } else {
            this.tabs.removeEvent(event, this._show);
        }

        if (event === 'mouseover' && this.options.preventDefault) {
            this.tabs.addEvent('click', function(e) {
                e.preventDefault();
            });
        }

        return this;
    }.protect()

});

/**
 * Enable tabular sections on an Element by calling tabs().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('tabs-id').tabs({
 *         collapsible: false
 *     });
 *
 * @param {Object} [options]
 * @returns {Titon.Tabs}
 */
Element.implement('tabs', function(options) {
    if (this.$tabs) {
        return this.$tabs;
    }

    this.$tabs = new Titon.Tabs(this, options);

    return this.$tabs;
});

})();