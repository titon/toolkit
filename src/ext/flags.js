/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Is the device in landscape mode
export const landscape = (window.innerWidth > window.innerHeight);

// Is the device in portrait mode
export const portrait = !landscape;

// Does the device support retina display
export const retina = (window.devicePixelRatio > 1);

// Is the HTML document currently set to RTL mode
export const rtl = (document.documentElement.dir === 'rtl');

// Does the device support touch controls
export const touch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// Export all as an object
export default {
    landscape,
    portrait,
    retina,
    rtl,
    touch
};
