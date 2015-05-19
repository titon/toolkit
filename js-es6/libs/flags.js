/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Is the device in landscape mode
export var landscape = (window.innerWidth > window.innerHeight);

// Is the device in portrait mode
export var portrait = !landscape;

// Does the device support retina display
export var retina = (window.devicePixelRatio > 1);

// Is the HTML document currently set to RTL mode
export var rtl = (document.documentElement.dir === 'rtl');

// Does the device support touch controls
export var touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Export all as an object
export default {
    landscape,
    portrait,
    retina,
    rtl,
    touch
};
