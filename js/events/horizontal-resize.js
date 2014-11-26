/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery'
], function($) {

/**
 * An event that triggers when a horizontal browser window resize occurs.
 *
 * @returns {Object}
 */
$.event.special.horizontalresize = (function() {
    var win = $(window),
        lastWidth = win.width();

    function handleResize(e) {
        var currentWidth = win.width();

        if (currentWidth !== lastWidth) {
            lastWidth = currentWidth;

            $(e.target).trigger('horizontalresize');
        }
    }

    return {
        setup: function() {
            win.on('resize', handleResize);
        },
        teardown: function() {
            win.off('resize', handleResize);
        }
    };
})();

});