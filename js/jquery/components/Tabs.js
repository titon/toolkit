/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Toolkit.Tabs = Toolkit.Component.create(function(element, options) {

    /** Custom options */
    this.options = this.setOptions(Toolkit.Tabs.options, options);

    /** Tabs wrapper */
    this.element = this.setElement(element, this.options);

    /** Navigation container */
    this.nav = null;

    /** Collection of content sections */
    this.sections = [];

    /** Collection of tabs (anchor links) */
    this.tabs = [];

    /** The current and previous shown indices */
    this.previousIndex = 0;
    this.currentIndex = 0;

    /** Cached requests */
    this.cache = {};

    /** Is the component enabled? */
    this.enabled = true;

    /**
     * Initialize the component by fetching elements and binding events.
     */
    this.initialize = function() {
        var options = this.options;

        if (!options.cookie) {
            this.options.cookie = options.cookie = this.element.attr('id');
        }

        // Get elements
        this.nav = this.element.find(options.navElement);

        this.tabs = this.nav.find('ul > li > a');
        this.tabs.each(function(index) {
            $(this).data('index', index).removeClass('is-active');
        });

        this.sections = this.element.find(options.sectionsElement);
        this.sections.conceal();

        // Set events
        this.tabs.on((options.mode === 'click' ? 'click' : 'mouseover'), this.__show.bind(this));

        if (options.mode === 'hover' && options.preventDefault) {
            this.tabs.on('click', function(e) {
                e.preventDefault();
            });
        }

        this.fireEvent('init');

        // Trigger default tab to display
        var index = options.defaultIndex;

        if (options.persistState) {
            var cookie = 'toolkit.tabs.' + options.cookie,
                value = document.cookie.match('(?:^|;)\\s*' + cookie.replace(/[\-\.\+\*]/g, '\\$&') + '=([^;]*)');

            if (value && value.length) {
                index = decodeURIComponent(value[1]);
            }

        } else if (options.loadFragment && location.hash) {
            var tab = this.tabs.filter(function() {
                return ($(this).attr('href') === location.hash);
            });

            if (tab.length) {
                index = $(tab[0]).data('index');
            }
        }

        if (!this.tabs[index]) {
            index = 0;
        }

        this.jump(index);
    };

    /**
     * Hide all sections.
     *
     * @returns {Toolkit.Tabs}
     */
    this.hide = function() {
        this.sections.conceal();

        this.fireEvent('hide', this.node);

        return this;
    };

    /**
     * Jump to a specific tab via index.
     *
     * @param {Number} index
     * @returns {Toolkit.Tabs}
     */
    this.jump = function(index) {
        if (this.tabs[index]) {
            this.show(this.tabs[index]);
        }

        return this;
    };

    /**
     * Show the content based on the tab. Can either pass an integer as the index in the collection,
     * or pass an element object for a tab in the collection.
     *
     * @param {jQuery} tab
     * @returns {Toolkit.Tabs}
     */
    this.show = function(tab) {
        tab = $(tab);

        var index = tab.data('index'),
            section = $(this.sections[index]),
            url = this.readValue(tab, this.options.getUrl);

        // Load content with AJAX
        if (this.options.ajax && url && url.substr(0, 1) !== '#' && !this.cache[url]) {
            this.requestData(
                'tabs',
                url,
                function tabsAjaxBefore() {
                    section.html(this._loadingTemplate('tabs'))
                        .addClass('is-loading');
                },
                function tabsAjaxDone(response) {
                    this.cache[url] = true;

                    section.html(response)
                        .removeClass('is-loading');

                    this.fireEvent('load', response);
                },
                function tabsAjaxFail() {
                    section.html(this._errorTemplate('tabs'))
                        .removeClass('is-loading')
                        .addClass('has-failed');
                }
            );
        }

        // Toggle tabs
        this.nav.find('ul > li').removeClass('is-active');

        // Toggle sections
        if (index === this.currentIndex && this.options.collapsible) {
            if (section.is(':shown')) {
                section.conceal();

            } else {
                tab.parent().addClass('is-active');
                section.reveal();
            }
        } else {
            this.hide();

            tab.parent().addClass('is-active');
            section.reveal();
        }

        // Persist the state using a cookie
        if (this.options.persistState) {
            var cookie = 'toolkit.tabs.' + this.options.cookie + '=' + encodeURIComponent(index);
            var date = new Date();
                date.setTime(date.getTime() + this.options.cookieDuration * 24 * 60 * 60 * 1000);

            cookie += '; expires=' + date.toUTCString();
            cookie += '; path=/';

            document.cookie = cookie;
        }

        // Track
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;

        this.fireEvent('show', tab);

        // Set current node
        this.node = tab;

        return this;
    };

    /**
     * Event callback for tab element click.
     *
     * @private
     * @param {Event} e
     */
    this.__show = function(e) {
        if (this.options.preventDefault || (this.options.ajax && $(e.target).attr('href').substr(0, 1) !== '#')) {
            e.preventDefault();
        }

        if (!this.enabled) {
            return;
        }

        this.show(e.target);
    };

    if (this.element.length) {
        this.initialize();
    }
});

Toolkit.Tabs.options = {
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
    sectionsElement: '.tabs-section'
};

/**
 * Enable tabular sections on an Element by calling tabs().
 * An object of options can be passed as the 1st argument.
 * The class instance will be cached and returned from this function.
 *
 * @example
 *     $('#tabs-id').tabs({
 *         collapsible: false
 *     });
 *
 * @param {Object} [options]
 * @returns {jQuery}
 */
$.fn.tabs = function(options) {
    return this.each(function() {
        if (!this.$tabs) {
            this.$tabs = new Toolkit.Tabs(this, options);
        }
    });
};

})(jQuery);