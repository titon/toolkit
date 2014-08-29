define([
    'jquery',
    './core'
], function($, Toolkit) {

// Empty class to extend from
Toolkit.Class = function() {};

// Flag to determine if a constructor is initializing
var constructing = false;

/**
 * Very basic method for allowing functions to inherit functionality through the prototype.
 *
 * @param {Object} properties
 * @param {Object} options
 * @returns {Function}
 */
Toolkit.Class.extend = function(properties, options) {
    constructing = true;
    var prototype = new this();
    constructing = false;

    // Inherit the prototype and merge properties
    $.extend(prototype, properties);

    // Class interface
    function Class() {

        // Exit constructing if being applied as prototype
        if (constructing) {
            return;
        }

        // Reset (clone) the array and object properties else they will be referenced between instances
        for (var key in this) {
            var value = this[key],
                type = $.type(value);

            if (type === 'array') {
                this[key] = value.slice(0); // Clone array

            } else if (type === 'object') {
                this[key] = $.extend(true, {}, value); // Clone object

            } else if (type === 'function') {
                this[key] = value.bind(this); // Required for bindEvents()
            }
        }

        // Set the UID and increase global count
        this.uid = Class.count += 1;

        // Generate the CSS class name and attribute/event name based off the plugin name
        var name = this.name;

        if (name) {
            this.cssClass = name.replace(/[A-Z]/g, function(match) {
                return ('-' + match.charAt(0).toLowerCase());
            }).slice(1);

            // Generate an attribute and event key name based off the plugin name
            this.keyName = name.charAt(0).toLowerCase() + name.slice(1);
        }

        // Trigger constructor
        if (properties.constructor) {
            properties.constructor.apply(this, arguments);
        }
    }

    // Inherit the prototype
    Class.prototype = prototype;
    Class.prototype.constructor = Class;

    // Inherit and set default options
    Class.options = $.extend(true, {}, this.options || {}, options || {});

    // Inherit the extend method
    Class.extend = this.extend;

    // Count of total instances
    Class.count = 0;

    return Class;
};

return Toolkit;
});