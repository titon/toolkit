/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function($) {
    'use strict';

    Toolkit.Popover = Toolkit.Tooltip.create(function(nodes, options) {
        this.component = 'Popover';
        this.version = '0.0.0';

        /** Custom options */
        this.options = this.setOptions(Toolkit.Popover.options, options);

        /** List of nodes to activate tooltip */
        this.nodes = $(nodes);

        /** Tooltip wrapper */
        this.element = this.createElement(this.options);

        /** Inner elements */
        this.elementHead = null;
        this.elementBody = null;

        /** Cached requests */
        this.cache = {};

        this.initialize();
    });

    Toolkit.Popover.options = {
        mode: 'click',
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
    };

    /**
     * Defines a component that can be instantiated through popover().
     */
    Toolkit.createComponent('popover', function(options) {
        return new Toolkit.Popover(this, options);
    }, true);

})(jQuery);