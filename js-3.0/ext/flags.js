/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

export let

    // Is the device in landscape mode
    isLandscape = (window.innerWidth > window.innerHeight),

    // Is the device in portrait mode
    isPortrait = !isLandscape,

    // Does the device support retina display
    isRetina = (window.devicePixelRatio > 1),

    // Is the HTML document currently set to RTL mode
    isRTL = (document.documentElement.dir === 'rtl'),

    // Does the device support touch controls
    isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),

    // Export all as an object
    flags = {
        landscape: isLandscape,
        portrait: isPortrait,
        retina: isRetina,
        rtl: isRTL,
        touch: isTouch
    };

export default flags;
