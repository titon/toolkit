define([
    'jquery',
    '../core'
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