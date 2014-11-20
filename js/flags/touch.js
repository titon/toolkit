/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define(function() {

// Does the device support touch controls
var isTouch = !!(('ontouchstart' in window) || (window.DocumentTouch && document instanceof DocumentTouch));

return isTouch;
});