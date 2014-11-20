/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery'
], function($) {

/**
 * Set data if the key does not exist, else return the current value.
 * If the value is a function, it will be executed to extract a value.
 *
 * @param {String} key
 * @param {*} [value]
 * @returns {*}
 */
$.fn.cache = function(key, value) {
    var data = this.data(key),
        type = $.type(data);

    if (type !== 'undefined' && type !== 'null') {
        return data;

    } else if ($.type(value) === 'function') {
        value = value.call(this);
    }

    this.data(key, value);

    return value;
};

});