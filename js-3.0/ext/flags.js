/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

export let

    // Is the device in landscape mode
    landscape = (window.innerWidth > window.innerHeight),

    // Is the device in portrait mode
    portrait = !landscape,

    // Does the device support retina display
    retina = (window.devicePixelRatio > 1),

    // Is the HTML document currently set to RTL mode
    rtl = (document.documentElement.dir === 'rtl'),

    // Does the device support touch controls
    touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0),

    // Export all as an object
    flags = {
        landscape,
        portrait,
        retina,
        rtl,
        touch
    };

export default flags;
