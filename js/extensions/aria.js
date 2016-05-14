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
function setAriaValue(value) {
    if (value === true) {
        value = 'true';
    } else if (value === false) {
        value = 'false';
    }

    return value;
}

$.fn.aria = function(key, value) {
    if (!Toolkit.aria) {
        return this;
    }

    if (key === 'toggled') {
        key = { expanded: value, selected: value };
        value = undefined;
    }

    // Multi-setter
    if ($.type(key) === 'object') {
        Object.keys(key).forEach(function(k) {
            this.attr('aria-' + k, setAriaValue(key[k]));
        }.bind(this));

        return this;

    // Setter
    } else if ($.type(value) !== 'undefined') {
        this.attr('aria-' + key, setAriaValue(value));

        return this;
    }

    // Getter
    return this.attr('aria-' + key);
};

});
