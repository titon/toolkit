/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Provides an easy way to lazy-load elements (primarily images) on the page to conserve bandwidth and improve page loading times.
 * 
 * @version	0.2
 * @uses	Titon
 * @uses	Core/Events
 * @uses	Core/Options
 * @uses	Core/Fx.Tween (For fading)
 * @uses	Core/Element.*
 */
 Titon.LazyLoad = new Class({
	Implements: [Events, Options],
	
	/**
	 * Have all elements been force loaded?
	 */
	loaded: false,
	
	/**
	 * Default options.
	 */
	options: {
		fade: false,
		forceLoad: false,
		threshhold: 150,
		delay: 5000,
		container: window
	},
	
	/**
	 * DOM query used for binding.
	 */
	query: '',
	
	/**
	 * Initialize container events, append CSS styles based on query, instantly load() elements in viewport and set force load timeout if option is true.
	 *
	 * @param query
	 * @param options
	 */
	initialize: function(query, options) {
		this.setOptions(options);
		this.query = query;
		
		// Setup CSS styles
		var sheet = document.createElement('style');
		sheet.innerHTML = query + ' * { display: none !important; }';
		
		document.head.grab(sheet);
		
		// Add events
		this.container.addEvents({
			scroll: this.load,
			resize: this.load
		});
		
		// Load elements within viewport
		this.load();
		
		// Set force load on DOM ready
		if (this.options.forceLoad) {
			window.addEvent('load', function() {
				window.setTimeout(this.loadAll.bind(this), this.options.delay);
			});
		}
	},
	
	/**
	 * When triggered, will shutdown the instance from executing any longer.
	 * Any container events will be removed and loading will cease.
	 */
	shutdown: function() {
		this.loaded = true;
		
		this.container.removeEvents({
			scroll: this.load,
			resize: this.load
		});
	},
	
	/**
	 * Loop over the lazy loaded elements and verify they are within the viewport.
	 *
	 * @param e
	 * @return boolean
	 */
	load: function(e) {
		if (this.loaded) {
			return false;
		}
		
		e.stop();
		
		var elements = $$(this.query);
		
		if (elements.length == 0) {
			this.shutdown();
			
			return false;
		}
		
		elements.each(function(node) {
			node = new Element(node);
			
			if (this.inViewport(node)) {
				this.show(node);
			}
		}, this);

		return true;
	},
	
	/**
	 * Load the remaining hidden elements and remove any container events.
	 *
	 * @return boolean
	 */
	loadAll: function() {
		if (this.loaded) {
			return false;
		}
		
		$$(this.query).each(function(node) {
			this.show(new Element(node));
		}, this);
		
		this.shutdown();
		
		return true;
	},
	
	/**
	 * Show or fade in the element by removing the lazy load class.
	 *
	 * @param node
	 */
	show: function(node) {
		if (this.options.fade) {
			var children = node.getChildren();
			
			children.hide();
			node.removeClass(this.query);
			children.fade('in');
			
		} else {
			node.removeClass(this.query);
		}
		
		this.fireEvent('show');
	},
	
	/**
	 * Verify that the element is within the current browser viewport.
	 *
	 * @param node
	 * @return boolean
	 */
	inViewport: function(node) {
		var threshhold = this.options.threshhold,
			scrollSize = window.getScroll(),
			windowSize = window.getSize(),
			nodeOffset = node.getPosition();

		return (
			// Below the top
			((nodeOffset.y - threshhold) >= scrollSize.y) &&
			// Above the bottom
			(nodeOffset.y <= (scrollSize.y + windowSize.y + threshhold)) &&
			// Right of the left
			((nodeOffset.x - threshhold) >= scrollSize.x) &&
			// Left of the right
			(nodeOffset.x <= (scrollSize.x + windowSize.x + threshhold))
		);
	}
	
});

/**
 * All instances loaded via factory().
 */
Titon.LazyLoad.instances = {};

/**
 * Easily create multiple instances.
 * 
 * @param query
 * @param options
 */
Titon.LazyLoad.factory = function(query, options) {
	var instance = new Titon.LazyLoad(query, options);
	
	Titon.LazyLoad.instances[query] = instance;
	
	return instance;
};