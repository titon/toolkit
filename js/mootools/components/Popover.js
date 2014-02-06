/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

(function() {
    'use strict';

Toolkit.Popover = new Class({
    Extends: Toolkit.Tooltip,

    /** Default options */
    options: {
        delegate: '.js-popover',
        position: 'topCenter',
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
    },

    /**
     * Initialize the component by fetching elements and binding events.
     *
     * @param {String} query
     * @param {Object} [options]
     */
    initialize: function(query, options) {
        options = options || {};
        options.mode = 'click';
        options.follow = false;

        this.parent(query, options);
    }

});

    /**
     * Defines a component that can be instantiated through popover().
     */
    Toolkit.createComponent('popover', function(options) {
        return new Toolkit.Popover(this, options);
    }, true);

})();