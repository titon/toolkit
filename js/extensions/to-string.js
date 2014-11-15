/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery'
], function($) {

/**
 * Return the markup of the element in the collection as a string.
 *
 * @returns {String}
 */
$.fn.toString = function() {
    return this.prop('outerHTML');
};

});