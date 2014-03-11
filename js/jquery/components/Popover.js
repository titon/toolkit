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
        this.version = '1.1.0';
        this.options = options = this.setOptions(options);
        this.element = element = this.createElement();
        this.elementHead = element.find(options.titleElement);
        this.elementBody = element.find(options.contentElement);
        this.nodes = nodes = $(nodes);
        this.node = null;
        this.cache = {};
        this.events = {};
        this.runtime = {};

        // Force to click for popovers
        options.mode = 'click';

        // Remove class since were using runtime
        element.removeClass(options.className);

        // Remove title attributes
        nodes.each(function(i, node) {
            $(node).attr('data-popover-title', $(node).attr('title')).removeAttr('title');
        });

        if (options.getTitle === 'title') {
            options.getTitle = 'data-popover-title';
        }

        // Initialize events
        this.events['clickout element'] = 'hide';
        this.events['clickout ' + nodes.selector] = 'hide';
        this.events['click ' + nodes.selector] = 'onShow';

        this.enable();
        this.fireEvent('init');
    }, {
    }, {
        getContent: 'data-popover',
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