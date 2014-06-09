define(function() {

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {Object} data
 * @param {Function} fn
 * @returns {jQuery}
 */
$.fn.transitionend = function(data, fn) {
    var name = Toolkit.transitionEnd;

    if (arguments.length > 0) {
        this.one(name, null, data, fn);

        // No transition defined so trigger callback immediately
        var duration = this.css("transition-duration");

        if (duration === "0s" || typeof duration === 'undefined') {
            this.trigger(name);
        }
    } else {
        this.trigger(name);
    }

    return this;
};

});