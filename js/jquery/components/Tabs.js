/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Tabs = Toolkit.Component.extend(function(element, options) {
        var events, tabs;

        this.component = 'Tabs';
        this.version = '1.0.0';
        this.element = element = $(element);
        this.options = options = this.setOptions(options, element);
        this.nav = element.find(options.navElement);
        this.tabs = tabs = this.nav.find('ul > li > a');
        this.sections = element.find(options.sectionElement).conceal();
        this.index = 0;
        this.cache = {};
        this.events = events = {};

        // Determine cookie name
        if (!options.cookie) {
            options.cookie = element.attr('id');
        }

        // Cache index for tabs
        tabs.each(function(index) {
            $(this).data('index', index).removeClass(Toolkit.options.isPrefix + 'active');
        });

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
                url = this.readValue(tab, options.getUrl),
                isPrefix = Toolkit.options.isPrefix;

            // Load content with AJAX
            if (options.ajax && url && url.substr(0, 1) !== '#' && !this.cache[url]) {
                this.requestData(url,
                    function() {
                        section.html(this._loadingTemplate())
                            .addClass(isPrefix + 'loading');
                    },
                    function(response) {
                        this.cache[url] = true;

                        section.html(response)
                            .removeClass(isPrefix + 'loading');

                        this.fireEvent('load', response);
                    },
                    function() {
                        section.html(this._errorTemplate())
                            .removeClass(isPrefix + 'loading')
                            .addClass(Toolkit.options.hasPrefix + 'failed');
                    }
                );
            }

            // Toggle tabs
            this.nav.find('ul > li').removeClass(isPrefix + 'active');

            // Toggle sections
            if (index === this.index && options.collapsible) {
                if (section.is(':shown')) {
                    section.conceal();

                } else {
                    tab.parent().addClass(isPrefix + 'active');
                    section.reveal();
                }
            } else {
                this.hide();

                tab.parent().addClass(isPrefix + 'active');
                section.reveal();
            }

            // Persist the state using a cookie
            if (options.persistState) {
                $.cookie('toolkit.tabs.' + options.cookie, index, {
                    expires: options.cookieDuration
                });
            }

            // Track
            this.index = index;

            this.fireEvent('show', tab);

            // Set current node
            this.node = tab;
        },

        /**
         * Event callback for tab element click.
         *
         * @private
         * @param {jQuery.Event} e
         */
        onShow: function(e) {
            if (this.options.preventDefault || (this.options.ajax && e.target.href.substr(0, 1) !== '#')) {
                e.preventDefault();
            }

            this.show(e.target);
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
    Toolkit.createComponent('tabs', function(options) {
        return new Toolkit.Tabs(this, options);
    });

})(jQuery);