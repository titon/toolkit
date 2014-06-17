define([
    'jquery',
    '../flags/transition'
], function($, hasTransition) {

// Store the event name in a variable
var transitionEnd = (function() {
    var eventMap = {
        WebkitTransition: 'webkitTransitionEnd',
        OTransition: 'oTransitionEnd otransitionend'
    };

    return eventMap[hasTransition] || 'transitionend';
})();

/**
 * Set a `transitionend` event. If the element has no transition set, trigger the callback immediately.
 *
 * @param {Object} data
 * @param {Function} fn
 * @returns {jQuery}
 */
$.fn.transitionend = function(data, fn) {
    if (arguments.length > 0) {
        this.one(transitionEnd, null, data, fn);

        // No transition defined so trigger callback immediately
        var duration = this.css("transition-duration");

        if (duration === "0s" || typeof duration === 'undefined') {
            this.trigger(transitionEnd);
        }
    } else {
        this.trigger(transitionEnd);
    }

    return this;
};

});