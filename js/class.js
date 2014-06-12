define([
    './core'
], function(Toolkit) {

// Empty class to extend from
Toolkit.Class = function() {};

/**
 * Very basic method for allowing functions to inherit functionality through the prototype.
 *
 * @param {Object} properties
 * @param {Object} options
 * @returns {Function}
 */
Toolkit.Class.extend = function(properties, options) {
    var initializing = false;

    var Class = function() {

        // Exit constructing if being applied as prototype
        if (initializing) {
            return;
        }

        // Bind all methods with the class context
        // - Allows event listeners to work automatically without having to bind() them
        // - Fixes issues with bindEvents() where events cant be turned off
        for (var key in this) {
            if (typeof this[key] === 'function') {
                this[key] = this[key].bind(this);
            }
        }

        // Set the UID and increase global count
        this.uid = Class.count += 1;

        // Trigger constructor
        if (properties.constructor) {
            properties.constructor.apply(this, arguments);
        }
    };

    // Inherit the prototype and merge properties
    initializing = true;
    Class.prototope = new this();
    initializing = false;

    if (properties) {
        $.extend(Class.prototype, properties);
    }

    // Inherit and set default options
    Class.options = $.extend(true, {}, this.options || {}, options || {});

    // Inherit the extend method
    Class.extend = this.extend;

    // Count of total instances
    Class.count = 0;

    // Use base as constructor
    Class.prototype.constructor = Class;

    return Class;
};

return Toolkit;
});