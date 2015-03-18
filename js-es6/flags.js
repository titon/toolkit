/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

'use strict';

export var

    // Does the device support retina display
    isRetina = (window.devicePixelRatio > 1),

    // Is the HTML document currently set to RTL mode
    isRTL = (document.documentElement.dir === 'rtl'),

    // Does the device support touch controls
    isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
