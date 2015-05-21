/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './flags/touch',
    './flags/retina',
    './flags/rtl',
    './flags/transition',
    './flags/transitionend',
    './extensions/cache'
], function($, isTouch, isRetina, isRTL, hasTransition, transitionEnd) {

var Toolkit = {

    /** Current version. */
    version: '%version%',

    /** Build date hash. */
    build: '%build%',

    /** CSS namespace. */
    namespace: '',

    /** ARIA support. */
    aria: true,

    /** Global debugging. */
    debug: false,

    /** Localization messages. */
    messages: {
        loading: 'Loading...',
        error: 'An error has occurred!'
    },

    /** BEM class name separators. */
    bemSeparators: ['-', '--'],

    /** Does the browser support transitions? */
    hasTransition: hasTransition,

    /** Detect touch devices. */
    isTouch: isTouch,

    /** Detect retina displays. */
    isRetina: isRetina,

    /** Detect right-to-left support. */
    isRTL: isRTL,

    /** Name of the `transitionend` event. */
    transitionEnd: transitionEnd,

    /** Plugin instances indexed by the selector that activated it. */
    cache: {},

    /**
     * Generate a BEM (block-element-modifier) valid CSS class name.
     *
     * @param {String} block
     * @param {String} [element]
     * @param {String} [modifier]
     * @returns {String}
     */
    bem: function(block, element, modifier) {
        var seps = Toolkit.bemSeparators;

        if (element) {
            block += seps[0] + element;
        }

        if (modifier) {
            block += seps[1] + modifier;
        }

        return Toolkit.namespace + block;
    },

    /**
     * Parse a value and convert it to a template string.
     * If the template is a function, execute it and pass the `bem()` function,
     * and the current namespace as arguments.
     *
     * @param {String|Function} template
     * @returns {String}
     */
    buildTemplate: function(template) {
        if (typeof template === 'function') {
            template = template.call(null, Toolkit.bem, Toolkit.namespace);
        }

        return template + '';
    },

    /**
     * Creates a jQuery plugin by extending the jQuery prototype with a method definition.
     * The Toolkit plugin is only initialized if one has not been already.
     * Plugins are either defined per element, or on a collection of elements.
     *
     * @param {String} plugin
     * @param {Function} callback
     * @param {bool} [collection]
     */
    createPlugin: function(plugin, callback, collection) {
        var name = plugin;

        // Prefix with toolkit to avoid collisions
        if ($.fn[name]) {
            name = 'toolkit' + name.charAt(0).toUpperCase() + name.slice(1);
        }

        $.fn[name] = collection ?

            // Apply the instance to a collection of elements
            function() {
                var instance = Toolkit.cache[plugin + ':' + this.selector] = callback.apply(this, arguments);

                return this.each(function() {
                    $(this).cache('toolkit.' + plugin, instance);
                });
            } :

            // Apply the instance per element
            function() {
                var args = arguments;

                return this.each(function() {
                    $(this).cache('toolkit.' + plugin, callback.apply(this, args));
                });
            };
    }

};

// Make it available
window.Toolkit = Toolkit;

return Toolkit;
});
