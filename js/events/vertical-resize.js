/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery'
], function($) {

/**
 * An event that triggers when a vertical browser window resize occurs.
 *
 * @returns {Object}
 */
$.event.special.verticalresize = (function() {
    var win = $(window),
        lastHeight = win.height();

    function handleResize(e) {
        var currentHeight = win.height();

        if (currentHeight !== lastHeight) {
            lastHeight = currentHeight;

            $(e.target).trigger('verticalresize');
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