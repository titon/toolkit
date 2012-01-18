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
 * @version	0.1
 * @uses	Titon
 * @uses	Core/Events
 * @uses	Core/Options
 * @uses	Core/Fx.Tween (For fading)
 * @uses	Core/Element.*
 */
 Titon.LazyLoad = new Class({
	Implements: [Events, Options],
	
	/**
	 * Has all elements been force loaded?
	 */
	loaded: false,
	
	/**
	 * Default options.
	 */
	options: {
		fade: false,
		forceLoad: false,
		className: 'lazy-load',
		threshhold: 150,
		delay: 2000,
		container: window
	},
	
	/**
	 * @todo
	 *
	 * @param options
	 */
	initialize: function(options) {
		this.setOptions(options);
		
		var sheet = document.createElement('style');
		sheet.innerHTML = '.' + this.options.className + ' * { display: none !important; }';
		
		document.head.grab(sheet);
		
		// Add events
		this.container.addEvents({
			scroll: this.reveal,
			resize: this.reveal
		});
		
		// Reveal elements within viewport
		this.reveal();
	},
	
	/**
	 * Loop over the lazy loaded elements and verify they are within the viewport.
	 * If options.forceLoad is true, it will kick off a timer to pre-fetch all the remaining elements.
	 *
	 * @param e
	 */
	reveal: function(e) {
		if (this.loaded) {
			return false;
		}
		
		e.stop();
		
		var elements = $$('.' + this.options.className);
		
		if (!elements.length) {
			this.loaded = true;
			return false;
		}
		
		toLoad.each(function(node) {
			if (this.inViewport(node)) {
				this.show(node);
			}
		}, this);
		
		if (typeof(e) !== 'null' && this.options.forceLoad) {
			window.setTimeout(this.revealAll.bind(this), this.options.delay);
		}
		
		return true;
	},
	
	/**
	 * Reveal the remaining hidden elements and remove any container events.
	 */
	revealAll: function() {
		if (this.loaded) {
			return false;
		}
		
		var className = this.options.className;
		
		$$('.' + className).removeClass(className);
		
		this.container.removeEvents({
			scroll: this.reveal,
			resize: this.reveal
		});
		
		this.loaded = true;
	},
	
	/**
	 * Show or fade in the element by removing the lazy load class.
	 *
	 * @param node
	 */
	show: function(node) {
		var className = this.options.className;
		
		if (this.options.fade) {
			var children = node.getChildren();
			
			children.hide();
			node.removeClass(className);
			children.fade('in');
		} else {
			node.removeClass(className);
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
			pageSize = window.getSize(),
			nodeOffset = node.getPosition();

		return (
			// Below the top fold
			((nodeOffset.y - threshhold) >= scrollSize.y) &&
			// Above the bottom fold
			(nodeOffset.y <= (scrollSize.y + pageSize.y + threshhold)) &&
			// Right of the left fold
			((nodeOffset.x - threshhold) >= scrollSize.x) &&
			// Left of the right fold
			(nodeOffset.x <= (scrollSize.x + pageSize.x + threshhold))
		);
	}
	
});

/**
 * All instances loaded via factory().
 */
Titon.LazyLoad.instances = [];

/**
 * Easily create multiple instances.
 * 
 * @param options
 */
Titon.LazyLoad.factory = function(options) {
	var instance = new Titon.LazyLoad(options);
	
	Titon.LazyLoad.instances.push(instance);
	
	return instance;
};