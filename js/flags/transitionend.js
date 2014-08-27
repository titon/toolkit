define([
    './transition'
], function(hasTransition) {

// Store the event name in a variable
var transitionEnd = (function() {
    var eventMap = {
        WebkitTransition: 'webkitTransitionEnd',
        OTransition: 'oTransitionEnd otransitionend'
    };

    return eventMap[hasTransition] || 'transitionend';
})();

return transitionEnd;
});