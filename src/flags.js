/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Is the device in landscape mode
export const LANDSCAPE = (window.innerWidth > window.innerHeight);

// Is the device in portrait mode
export const PORTRAIT = !LANDSCAPE;

// Does the device support retina display
export const RETINA = (window.devicePixelRatio > 1);

// Is the HTML document currently set to RTL mode
export const RTL = (document.documentElement.dir === 'rtl');

// Does the device support touch controls
export const TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Export all as an object
const flags = Object.freeze({
    landscape: LANDSCAPE,
    portrait: PORTRAIT,
    retina: RETINA,
    rtl: RTL,
    touch: TOUCH
});

export default flags;
