
Titon.Tooltip = new Class({
	
	object: null,
	objectHead: null,
	objectBody: null,
	
	node: null,

	cache: {},
	
	config: {},
	
	defaultConfig: {
		isAjax: false,
		className: '',
		position: 'topRight',
		showLoading: true
	},
	
	isVisible: false,
	
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
	
	configure: function(config) {
		if (config)
			this.defaultConfig = Object.merge(this.defaultConfig, config);
	},
	
	listen: function(e) {
		e.stop();
		
		var node = e.target,
			content = node.get('data-tooltip'),
			config = node.get('data-tooltip-config');
			
		if (config !== null) {
			this.config = Object.merge(this.defaultConfig, Titon.parseConfig(config));
		} else {
			this.config = this.defaultConfig;
		}
		
		this.show(node, content);
	},
	
	show: function(node, content) {
		this.node = new Element(node);
		
		// Set mouse events
		var callback = function(e) {
			this.node = null;
			this.hide();
		}.bind(this);
		
		this.node
			.removeEvent('mouseout', callback)
			.addEvent('mouseout', callback);

		// Do an AJAX call using content as the URL
		if (this.config.isAjax) {
			var url = content || this.node.get('href');

			if (this.cache[url]) {
				this.display(this.cache[url]);
				
			} else {
				new Request({
					url: url,
					method : 'get',
					evalScripts: true,
					
					onSuccess: function(response) {
						this.cache[url] = response;
						this.display(response);
					}.bind(this),
					
					onRequest: function() {
						if (this.config.showLoading)
							this.display('Loading...');
					}.bind(this),
					
					onFailure: function() {
						this.hide();
					}.bind(this)
				}).get();
			}
			
		// Copy the content found in the referenced ID
		} else if (content.substr(0, 1) === '#') {
			this.display( document.id(content.replace('#', '')).get('html') );
			
		// Probably a string
		} else {
			this.display(content);
		}
	},
	
	hide: function() {
		this.isVisible = false;
		this.object.hide();
	},
	
	display: function(content) {
		var position = this.config.position;
			
		this.isVisible = true;
		this.objectBody.set('html', content);
			
		// Follow the mouse
		if (position === 'mouse') {
			this.node
				.removeEvent('mousemove', this.followMouse.bind(this))
				.addEvent('mousemove', this.followMouse.bind(this));
				
			return;
		}
		
		// Position accordingly
		var edgeMap = {
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
			edge: edgeMap[position] || 'topLeft'
		}).show(true);
	},
	
	followMouse: function(e) {
		e.stop();
		
		this.object.setPosition({
			x: (e.page.x + 10),
			y: (e.page.y + 10)
		}).show(true);
	}
	
});

Titon.Tooltip.instances = [];

Titon.Tooltip.factory = function(query, config) {
	var instance = new Titon.Tooltip(query, config);
	
	Titon.Tooltip.instances.push( instance );
	
	return instance;
};