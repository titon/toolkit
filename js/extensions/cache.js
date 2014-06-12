define(function() {

/**
 * Set data if the key does not exist, else return the current value.
 * If the value is a function, it will be executed to extract a value.
 *
 * @param {String} key
 * @param {*} value
 * @returns {*}
 */
$.fn.cache = function(key, value) {
    var data = this.data(key);

    if (data) {
        return data;

    } else if (typeof value === 'function') {
        value = value.call(this);
    }

    this.data(key, value);

    return value;
};

});