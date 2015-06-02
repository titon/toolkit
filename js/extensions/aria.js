/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit'
], function($, Toolkit) {

/**
 * A multi-purpose getter and setter for ARIA attributes.
 * Will prefix attribute names and cast values correctly.
 *
 * @param {Element} element
 * @param {String|Object} key
 * @param {*} value
 */
function doAria(element, key, value) {
    if ($.type(value) === 'undefined') {
        return element.getAttribute('aria-' + key);
    }

    if (value === true) {
        value = 'true';
    } else if (value === false) {
        value = 'false';
    }

    element.setAttribute('aria-' + key, value);
}

$.fn.aria = function(key, value) {
    if (!Toolkit.aria) {
        return this;
    }

    if (key === 'toggled') {
        key = { expanded: value, selected: value };
        value = null;
    }

    return $.access(this, doAria, key, value, arguments.length > 1);
};

});
