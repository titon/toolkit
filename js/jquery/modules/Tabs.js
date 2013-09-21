/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

Titon.Tabs = function(element, options) {

    /** Custom options */
    this.options = this.setOptions($.fn.tabs.options, options);

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

        this.options.cookie = options.cookie = (options.cookie || this.element.attr('id')).hyphenate();

        // Get elements
        this.nav = this.element.find(options.navElement);

        this.tabs = this.nav.find('ul > li > a');
        this.tabs.each(function(index) {
            $(this).data('index', index).removeClass('is-active');
        });

        this.sections = this.element.find(options.sectionsElement);
        this.sections.conceal();

        // Set events
        this.tabs.on((this.options.mode === 'click' ? 'click' : 'mouseover'), this.__show.bind(this));

        if (this.options.mode === 'mouseover' && this.options.preventDefault) {
            this.tabs.on('click', function(e) {
                e.preventDefault();
            });
        }

        // Trigger default tab to display
        var index = options.defaultIndex;

        if (options.persistState) {
            var cookie = 'titon.tabs.' + options.cookie,
                value = document.cookie.match('(?:^|;)\\s*' + cookie.replace(/[\-\.\+\*]/g, "\\$&") + '=([^;]*)');

            if (value) {
                index = decodeURIComponent(value[1]);
            }
        }

        this.jump(index);
    };

    /**
     * Hide all sections.
     *
     * @returns {Titon.Tabs}
     */
    this.hide = function() {
        this.sections.conceal();

        return this;
    };

    /**
     * Jump to a specific tab via index.
     *
     * @param {Number} index
     * @returns {Titon.Tabs}
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
     * @returns {Titon.Tabs}
     */
    this.show = function(tab) {
        tab = $(tab);

        var index = tab.data('index'),
            section = $(this.sections[index]),
            url = tab.attr('href');

        // Load content with AJAX
        if (this.options.ajax && url && !url.contains('#') && !this.cache[url]) {
            $.ajax({
                url: url,
                type: 'get',
                success: function(response) {
                    this.cache[url] = true;

                    section.html(response)
                        .removeClass('is-loading');
                }.bind(this),

                beforeSend: function() {
                    section.html(this._loadingTemplate('tabs'))
                        .addClass('is-loading');
                }.bind(this),

                error: function() {
                    section.html(this._errorTemplate('tabs'))
                        .removeClass('is-loading')
                        .addClass('has-failed');
                }.bind(this)
            });
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
            var cookie = 'titon.tabs.' + this.options.cookie + '=' + encodeURIComponent(index);
            var date = new Date();
                date.setTime(date.getTime() + this.options.cookieDuration * 24 * 60 * 60 * 1000);

            cookie += '; expires=' + date.toUTCString();
            cookie += '; path=/';
            cookie += '; secure';

            document.cookie = cookie;
        }

        // Track
        this.previousIndex = this.currentIndex;
        this.currentIndex = index;

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
        if (this.options.preventDefault) {
            e.preventDefault();
        }

        if (!this.enabled) {
            return;
        }

        this.show(e.target);
    };

    // Initialize the class only if the element exists
    if (this.element.length) {
        this.initialize();
    }
};

Titon.Tabs.prototype = new Titon.Component();
Titon.Tabs.prototype.constructor = Titon.Component;

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
 * @returns {Titon.Tabs}
 */
$.fn.tabs = function(options) {
    return this.each(function() {
        if (this.$tabs) {
            return this.$tabs;
        }

        this.$tabs = new Titon.Tabs(this, options);

        return this.$tabs;
    });
};

$.fn.tabs.options = {
    className: '',
    mode: 'click',
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
};

})(jQuery);