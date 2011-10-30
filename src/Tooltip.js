/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Creates dynamic tooltips that will display at a specific node or the mouse cursor.
 * 
 * @version	0.4
 * @uses	Titon
 * @uses	Core/Events
 * @uses	Core/Element.*
 * @uses	More/Element.Position
 *	
 * @todo
 *		- Fade in/out system (will have to remove position()?)
 *		- Delay for hide/show
 *		- Better AJAX support
 */
Titon.Tooltip = new Class({
	Implements: Events,
	
	/**
	 * DOM objects created to hold the tooltip content.
	 */
	object: null,
	objectHead: null,
	objectBody: null,
	
	/**
	 * Current node that activated the tooltip.
	 */
	node: null,
	
	/**
	 * Current tooltip title and content.
	 */
	title: null,
	content: null,

	/**
	 * A cache of all AJAX calls, indexed by the URL.
	 */
	cache: {},
	
	/**
	 * Dynamic configuration that changes per node.
	 */
	config: {},
	
	/**
	 * Default configuration.
	 */
	defaultConfig: {
		isAjax: false,
		className: '',
		position: 'topRight',
		showLoading: true,
		showTitle: true,
		titleQuery: 'title',
		contentQuery: 'data-tooltip',
		xOffset: 0,
		yOffset: 0
	},
	
	/**
	 * Is the tooltip currently visible?
	 */
	isVisible: false,
	
	/**
	 * Initialize tooltips for the passed DOM query. 
	 * Will apply event delegation and generate the HTML required for this tooltip instance.
	 * 
	 * @param query
	 * @param config
	 */
	initialize: function(query, config) {
		document.body.addEvent('mouseover:relay(' + query + ')', this.listen.bind(this));
		
		var outer = new Element('div.' + Titon.config.prefix + 'tooltip'),
			inner = new Element('div.tooltip-inner'),
			head = new Element('div.tooltip-head'),
			body = new Element('div.tooltip-body');
			
		inner.grab(head).grab(body);
		outer.grab(inner).inject( document.body );

		this.object = outer;
		this.objectHead = head;
		this.objectBody = body;
		
		this.configure(config);
	},
	
	/**
	 * Set the default configuration.
	 * 
	 * @param config
	 * @return Tooltip
	 * @chainable
	 */
	configure: function(config) {
		if (config) {
			this.defaultConfig = Object.merge(this.defaultConfig, config);
		}
		
		return this;
	},
	
	/**
	 * Callback to position the tooltip at the mouse cursor.
	 * 
	 * @param e
	 */
	followMouse: function(e) {
		e.stop();
		
		this.object.setPosition({
			x: (e.page.x + 10 + this.config.xOffset),
			y: (e.page.y + 10 + this.config.yOffset)
		}).show('block');
	},
	
	/**
	 * Hide the tooltip and set all relevant values to null.
	 */
	hide: function() {
		this.isVisible = false;
		
		this.node = null;
		this.title = null;
		this.content = null;
		
		if (this.config.className) {
			this.object.removeClass(this.config.className);
		}
		
		this.object.hide();
		this.fireEvent('hide');
	},
	
	/**
	 * Event callback for tooltip element mouseover.
	 * 
	 * @param e
	 */
	listen: function(e) {
		e.stop();
		
		var node = e.target,
			config = node.get('data-tooltip-config');
			
		this.show(node, Titon.parseConfig(config));
	},
	
	/**
	 * Positions the tooltip relative to the current node or the mouse cursor. 
	 * Additionally will apply the title/text and hide/show if necessary.
	 */
	position: function() {
		var config = this.config;
		
		// Apply styles and content
		if (config.className) {
			this.object.addClass(this.config.className);
		}
		
		if (this.title && config.showTitle) {
			this.objectHead.set('html', this.title).show();
		} else {
			this.objectHead.hide();
		}
		
		if (this.content) {
			this.objectBody.set('html', this.content).show();
		} else {
			this.objectBody.hide();
		}
			
		// Follow the mouse
		if (config.position === 'mouse') {
			this.node
				.removeEvent('mousemove', this.followMouse.bind(this))
				.addEvent('mousemove', this.followMouse.bind(this));

		// Position accordingly
		} else {
			var position = config.position,
				edgeMap = {
					topLeft: 'bottomRight',
					topCenter: 'bottomCenter',
					topRight: 'bottomLeft',
					centerLeft: 'centerRight',
					center: 'center',
					centerRight: 'centerLeft',
					bottomLeft: 'topRight',
					bottomCenter: 'topCenter',
					bottomRight: 'topLeft'
				};

			this.object.position({
				relativeTo: this.node,
				position: position,
				edge: edgeMap[position] || 'topLeft',
				offset: {
					x: config.xOffset,
					y: config.yOffset
				}
			}).show('block');
		}
		
		this.fireEvent('display');
		this.isVisible = true;
	},
	
	/**
	 * Attempt to read a value from multiple locations.
	 * DOM storage will always take precedent.
	 * 
	 * @param type
	 * @return mixed
	 */
	read: function(type) {
		var data = this.node.retrieve('tooltip:' + type),
			key = (type == 'title') ? this.config.titleQuery : this.config.contentQuery;
			
		if (data) {
			return data;
			
		} else if (typeOf(key) === 'function') {
			return key(this.node);
			
		} else {
			return this.node.get(key);
		}
	},
	
	/**
	 * Show the tooltip and determine whether to grab the content from an AJAX call,
	 * a DOM node, or plain text. Can pass a config object to overwrite the defaults.
	 * 
	 * @param node
	 * @param config
	 * @return boolean
	 */
	show: function(node, config) {
		if (!node) {
			return false;
		}
		
		// Configuration
		config = this.config = Titon.mergeConfig(this.defaultConfig, config);
		
		this.node = new Element(node);
		this.title = this.read('title');
		this.content = this.read('content');

		// Set mouse events
		this.fireEvent('show');
		
		this.node
			.removeEvent('mouseout', this.hide.bind(this))
			.addEvent('mouseout', this.hide.bind(this));

		// Do an AJAX call using content as the URL
		if (config.isAjax) {
			var url = this.content || this.node.get('href');

			if (this.cache[url]) {
				this.content = this.cache[url];
				this.position();
				
			} else {
				new Request({
					url: url,
					method : 'get',
					evalScripts: true,
					
					onSuccess: function(response) {
						this.cache[url] = response;
						this.content = response;
						this.position();
					}.bind(this),
					
					onRequest: function() {
						if (this.config.showLoading) {
							this.content = 'Loading...';
							this.position();
						}
					}.bind(this),
					
					onFailure: function() {
						this.hide();
					}.bind(this)
				}).get();
			}
			
		// Plain text
		} else {
			
			// Copy the content found in the referenced ID
			if (this.content.substr(0, 1) === '#') {
				this.content = document.id(this.content.replace('#', '')).get('html');
			}
			
			this.position();
		}
		
		return true;
	}
	
});

/**
 * All tooltip instances loaded via factory().
 */
Titon.Tooltip.instances = [];

/**
 * Easily create multiple tooltip instances.
 * 
 * @param query
 * @param config
 */
Titon.Tooltip.factory = function(query, config) {
	var instance = new Titon.Tooltip(query, config);
	
	Titon.Tooltip.instances.push(instance);
	
	return instance;
};