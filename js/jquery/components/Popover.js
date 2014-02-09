/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Popover = Toolkit.Tooltip.extend(function(nodes, options) {
        var element;

        this.component = 'Popover';
        this.version = '0.0.0';

        // Custom options
        this.options = options = this.setOptions(options);

        // List of nodes to activate tooltip
        this.nodes = nodes = $(nodes);

        // The current node
        this.node = null;

        // Tooltip wrapper
        this.element = element = this.createElement();
        this.elementHead = element.find(options.titleElement);
        this.elementBody = element.find(options.contentElement);

        // Cached requests
        this.cache = {};

        // Add position class
        element
            .addClass($.hyphenate(options.position))
            .clickout(this.hide.bind(this));

        // Set events
        $(options.context || document)
            .on('click', nodes.selector, this.__show.bind(this));

        this.fireEvent('init');
    }, {}, {
        ajax: false,
        position: 'topCenter',
        loadingMessage: Toolkit.messages.loading,
        showLoading: true,
        showTitle: true,
        getTitle: 'title',
        getContent: 'data-popover',
        xOffset: 0,
        yOffset: 0,
        delay: 0,
        titleElement: '.popover-head',
        contentElement: '.popover-body',
        template: '<div class="popover">' +
            '<div class="popover-inner">' +
                '<div class="popover-head"></div>' +
                '<div class="popover-body"></div>' +
            '</div>' +
            '<div class="popover-arrow"></div>' +
        '</div>'
    });

    /**
     * Defines a component that can be instantiated through popover().
     */
    Toolkit.createComponent('popover', function(options) {
        return new Toolkit.Popover(this, options);
    }, true);

})(jQuery);