/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Is the device in landscape mode?
export const LANDSCAPE = (window.innerWidth > window.innerHeight);

// Or is the device in portrait mode?
export const PORTRAIT = !LANDSCAPE;

// Does the device support retina display?
export const RETINA = (window.devicePixelRatio > 1);

// Does the device support touch controls?
export const TOUCH = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Is the HTML document currently set to RTL mode?
export const RTL = (document.documentElement.dir === 'rtl');

// Or is it set to LTR mode?
export const LTR = !RTL;

// Export as an object
export default Object.freeze({
    landscape: LANDSCAPE,
    ltr: LTR,
    portrait: PORTRAIT,
    retina: RETINA,
    rtl: RTL,
    touch: TOUCH
});
