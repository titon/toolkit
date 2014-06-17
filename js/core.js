define([
    'jquery',
    './flags/touch',
    './flags/retina',
    './flags/transition',
    './extensions/cache'
], function($, isTouch, isRetina, hasTransition) {

var Toolkit = {

    /** Current version */
    version: '%version%',

    /** Build date hash */
    build: '%build%',

    /** Vendor namespace */
    vendor: '',

    /** ARIA support */
    aria: true,

    /** Localization messages */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** Does the browser support transitions? */
    hasTransition: hasTransition,

    /** Event name for transition end */
    transitionEnd: (function() {
        var eventMap = {
            WebkitTransition: 'webkitTransitionEnd',
            OTransition: 'oTransitionEnd otransitionend'
        };

        return eventMap[hasTransition] || 'transitionend';
    })(),

    /** Detect touch devices */
    isTouch: isTouch,

    /** Detect retina displays */
    isRetina: isRetina,

    /** Plugin instances indexed by the selector that activated it */
    cache: {},

    /**
     * Creates a jQuery plugin by extending the jQuery prototype and defines a method
     * that initializes a component. The component is only initialized if one has not been already.
     * Components are either defined per element, or on a collection of elements.
     *
     * @param {String} component
     * @param {Function} callback
     * @param {bool} collection
     */
    create: function(component, callback, collection) {
        var name = component;

        // Prefix with toolkit to avoid collisions
        if ($.fn[name]) {
            name = 'toolkit' + name.charAt(0).toUpperCase() + name.slice(1);
        }

        $.fn[name] = collection ?

            // Apply the instance to a collection of elements
            function() {
                var instance = Toolkit.cache[component + '.' + this.selector] = callback.apply(this, arguments);

                return this.each(function() {
                    $(this).cache('toolkit.' + component, instance);
                });
            } :

            // Apply the instance per element
            function() {
                var args = arguments;

                return this.each(function() {
                    $(this).cache('toolkit.' + component, callback.apply(this, args));
                });
            };
    }
};

// Make it available
window.Toolkit = Toolkit;

return Toolkit;
});