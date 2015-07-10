/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Is the device in landscape mode
export var isLandscape = (window.innerWidth > window.innerHeight);

// Is the device in portrait mode
export var isPortrait = !isLandscape;

// Does the device support retina display
export var isRetina = (window.devicePixelRatio > 1);

// Is the HTML document currently set to RTL mode
export var isRTL = (document.documentElement.dir === 'rtl');

// Does the device support touch controls
export var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Export all as an object
var flags = {
    landscape: isLandscape,
    portrait: isPortrait,
    retina: isRetina,
    rtl: isRTL,
    touch: isTouch
};

export default flags;
