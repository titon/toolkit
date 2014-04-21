/**
 * @copyright   2010-2014, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

Toolkit.Popover = new Class({
    Extends: Toolkit.Tooltip,

    /** Default options */
    options: {
        delegate: '.js-popover',
        getContent: 'data-popover',
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

Toolkit.create('popover', function(options) {
    return new Toolkit.Popover(this, options);
}, true);