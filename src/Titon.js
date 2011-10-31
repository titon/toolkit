/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * The base object for all Titon classes. Contains global functionality and configuration.
 * 
 * @version	0.1.1 ALPHA
 */
var Titon = {

	/**
	 * Current version.
	 */
	version: '0.1.1 ALPHA',

	/**
	 * Options for all classes.
	 * 
	 *	prefix - Class name to prepend to all element containers
	 *	
	 */
	options: {
		prefix: 'titon-'
	},
	
	/**
	 * Converts a value to a specific scalar type.
	 * The value is extracted via parseOptions().
	 * 
	 * @param value
	 * @return mixed
	 */
	convertType: function(value) {
		if (value == 'true') {
			value = true;
			
		} else if (value == 'false') {
			value = false;
			
		} else if (value == 'null') {
			value = null;
			
		} else if (isNaN(value)) {
			value = String.from(value);
			
		} else {
			value = Number.from(value);
		}
		
		return value;
	},
	
	/**
	 * Merge custom options into the base. Clone the base as to not reference the original.
	 * 
	 * @param base
	 * @param options
	 * @return object
	 */
	mergeOptions: function(base, options) {
		return Object.merge(Object.clone(base), options || {});
	},
	
	/**
	 * Parse options out of the data-options attributes.
	 * Format: key1:value1;key2:value2
	 * 
	 * @param data
	 * @return object
	 */
	parseOptions: function(data) {
		var options = {};
		
		if (data) {
			data.split(';').each(function(item) {
				var pieces = item.split(':');

				if (pieces.length) {
					options[pieces[0]] = Titon.convertType(pieces[1]);
				}
			});
		}
		
		return options;
	},
	
	/**
	 * Apply custom options.
	 * 
	 * @param options
	 */
	setup: function(options) {
		Titon.options = Object.merge(Titon.options, options);
	}
	
};

/**
 * Prototype overrides.
 */
Element.implement({
	
	/**
	 * Show an element using its default display type, or pass a forced type.
	 * 
	 * @param force
	 */
	show: function(force) {
		this.setStyle('display', force || 'block');
	},

	/**
	 * Hide an element.
	 */
	hide: function() {
		this.setStyle('display', 'none');
	}
	
});