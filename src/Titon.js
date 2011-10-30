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
 * @version	0.1.0 ALPHA
 */
var Titon = {

	/**
	 * Current version.
	 */
	version: '0.1.0 ALPHA',

	/**
	 * Configuration for all classes.
	 * 
	 *	prefix - Class name to prepend to all element containers
	 *	
	 */
	config: {
		prefix: 'titon-'
	},
	
	/**
	 * Converts a value to a specific scalar type.
	 * The value is extracted via parseConfig().
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
	 * Merge custom config into the base. Clone the base as to not reference the original.
	 * 
	 * @param base
	 * @param config
	 * @return object
	 */
	mergeConfig: function(base, config) {
		return Object.merge(Object.clone(base), config || {});
	},
	
	/**
	 * Parse configuration out of the data config attributes.
	 * Format: key1:value1;key2:value2
	 * 
	 * @param data
	 * @return object
	 */
	parseConfig: function(data) {
		var config = {};
		
		if (data) {
			data.split(';').each(function(item) {
				var pieces = item.split(':');

				if (pieces.length) {
					config[pieces[0]] = Titon.convertType(pieces[1]);
				}
			});
		}
		
		return config;
	},
	
	/**
	 * Apply custom configuration.
	 * 
	 * @param config
	 */
	setup: function(config) {
		Titon.config = Object.merge(Titon.config, config);
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
		this.setStyle('display', force || '');
	},

	/**
	 * Hide an element.
	 */
	hide: function() {
		this.setStyle('display', 'none');
	}
	
});