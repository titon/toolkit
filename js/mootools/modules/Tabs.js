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

    /** Default options */
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
     * Initialize the component by fetching elements and binding events.
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
        this.bindEvents();
        this.fireEvent('init');

        // Trigger default tab to display
        var index = Number.from(Cookie.read('titon.tabs.' + this.options.cookie) || this.options.defaultIndex);

        this.jump(index);
    },

    /**
     * Add events for tab click events.
     *
     * @returns {Titon.Tabs}
     */
    bindEvents: function() {
        this.tabs.addEvent((this.options.mode === 'click' ? 'click' : 'mouseover'), this.__show);

        if (this.options.mode === 'mouseover' && this.options.preventDefault) {
            this.tabs.addEvent('click', function(e) {
                e.preventDefault();
            });
        }

        return this;
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
    __show: function(e) {
        if (this.options.preventDefault) {
            e.preventDefault();
        }

        if (!this.enabled) {
            return;
        }

        this.show(e.target);
    }

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