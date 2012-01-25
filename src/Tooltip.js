/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * Creates dynamic tooltips that will display at a specific node or the mouse cursor.
 * 
 * @version	0.8
 * @uses	Titon
 * @uses	Core/Request
 * @uses	Core/Events
 * @uses	Core/Options
 * @uses	Core/Fx.Tween (For fading)
 * @uses	Core/Element.*
 * @uses	More/Element.Position
 *	
 * @changelog
 *	v0.8
 *		Fixed some incorrect customOptions usage
 *		Node now uses getOptions('tooltip')
 *	v0.7
 *		Fixed incorrect fireEvent() in position()
 *		Made factory() use objects instead of arrays
 *	v0.6
 *		Added fade support
 *		Added a delay time for show/hide
 */
Titon.Tooltip = new Class({
	Implements: [Events, Options],
	
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
	 * Dynamic options that change per node.
	 */
	customOptions: {},
	
	/**
	 * Default options.
	 */
	options: {
		ajax: false,
		fade: true,
		className: '',
		position: 'topRight',
		showLoading: true,
		showTitle: true,
		titleQuery: 'title',
		contentQuery: 'data-tooltip',
		xOffset: 0,
		yOffset: 0,
		delay: 0,
		onHide: null,
		onShow: null,
		onPosition: null
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
	 * @param options
	 */
	initialize: function(query, options) {
		this.setOptions(options);
		
		document.body.addEvent('mouseover:relay(' + query + ')', this.listen.bind(this));
		
		var outer = new Element('div.' + Titon.options.prefix + 'tooltip'),
			inner = new Element('div.tooltip-inner'),
			head = new Element('div.tooltip-head'),
			body = new Element('div.tooltip-body');
			
		inner.grab(head).grab(body);
		outer.grab(inner).inject(document.body).set('tween', {
			duration: 150,
			link: 'cancel'
		});

		this.object = outer;
		this.objectHead = head;
		this.objectBody = body;
	},

	/**
	 * Callback to position the tooltip at the mouse cursor.
	 * 
	 * @param e
	 */
	followMouse: function(e) {
		e.stop();
		
		this.object.setPosition({
			x: (e.page.x + 10 + this.customOptions.xOffset),
			y: (e.page.y + 10 + this.customOptions.yOffset)
		}).fade('show').show();
	},
	
	/**
	 * Hide the tooltip and set all relevant values to null.
	 */
	hide: function() {
		this.isVisible = false;
		
		this.node = null;
		this.title = null;
		this.content = null;
		
		if (this.customOptions.className) {
			this.object.removeClass(this.customOptions.className);
		}
		
		if (this.customOptions.fade) {
			this.object.fade('out');
		} else {
			this.object.removeProperty('style');
		}
		
		this.fireEvent('hide');
	},
	
	/**
	 * Event callback for tooltip element mouseover.
	 * 
	 * @param e
	 */
	listen: function(e) {
		e.stop();
		
		this.show(e.target);
	},
	
	/**
	 * Positions the tooltip relative to the current node or the mouse cursor. 
	 * Additionally will apply the title/text and hide/show if necessary.
	 */
	position: function() {
		var options = this.customOptions;
		
		// Apply styles and content
		if (options.className) {
			this.object.addClass(options.className);
		}
		
		if (this.title && options.showTitle) {
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
		if (options.position === 'mouse') {
			this.node
				.removeEvent('mousemove', this.followMouse.bind(this))
				.addEvent('mousemove', this.followMouse.bind(this));

		// Position accordingly
		} else {
			var position = options.position,
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
					x: options.xOffset,
					y: options.yOffset
				}
			});
			
			window.setTimeout(function() {
				if (this.customOptions.fade) {
					this.object.fade('in');
				} else {
					this.object.setStyle('opacity', 1);
				}
			}.bind(this), options.delay || 1);
		}
		
		this.isVisible = true;
		this.fireEvent('position');
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
			key = (type == 'title') ? this.customOptions.titleQuery : this.customOptions.contentQuery;
			
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
	 * a DOM node, or plain text. Can pass an options object to overwrite the defaults.
	 * 
	 * @param node
	 * @param options
	 * @return boolean
	 */
	show: function(node, options) {
		if (!node) {
			return false;
		}
		
		// Configuration
		node = new Element(node);
		options = this.customOptions = Titon.mergeOptions(this.options, node.getOptions('tooltip') || options);
		
		this.node = node;
		this.title = this.read('title');
		this.content = this.read('content');

		// Set mouse events
		this.fireEvent('show');
		
		this.node
			.removeEvent('mouseout', this.hide.bind(this))
			.addEvent('mouseout', this.hide.bind(this));

		// Do an AJAX call using content as the URL
		if (options.ajax) {
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
						if (this.customOptions.showLoading) {
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
				this.content = $(this.content.replace('#', '')).get('html');
			}
			
			this.position();
		}
		
		return true;
	}
	
});

/**
 * All instances loaded via factory().
 */
Titon.Tooltip.instances = {};

/**
 * Easily create multiple instances.
 * 
 * @param query
 * @param options
 */
Titon.Tooltip.factory = function(query, options) {
	var instance = new Titon.Tooltip(query, options);
	
	Titon.Tooltip.instances[query] = instance;
	
	return instance;
};