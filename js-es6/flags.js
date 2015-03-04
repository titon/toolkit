/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

// Does the device support retina display
export var isRetina = (window.devicePixelRatio > 1);

// Is the HTML document currently set to RTL mode
export var isRTL = (document.documentElement.dir === 'rtl');

// Does the device support touch controls
export var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
