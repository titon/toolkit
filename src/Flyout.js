
Titon.Flyout = new Class({
	Implements: [Events, Options],
	
	object: null,
	
	node: null,
	menu: null,
	
	data: [],
	dataMap: {},
	
	options: {
		delay: 500
	},
	
	initialize: function(query, url, options) {
		this.setOptions(options);
		
		this.object = new Element('div.' + Titon.config.prefix + 'flyout');
		this.object
			.inject( document.body )
			.addEvent('mouseenter', null)
			.addEvent('mouseleave', this.hide.bind(this));

		new Request.JSON({
			url: url,
			secure: true,
			onSuccess: this.load.bind(this)
		}).get();
		
		$$(query).addEvent('mouseover', this.listen.bind(this));
	},
	
	hide: function() {
		this.object.hide();
		this.fireEvent('hide');
	},
	
	listen: function(e) {
		e.stop();

		this.show(e.target, e.target.get('href'))
	},
	
	load: function(data) {
		this.data = data;
		this.loadDataMap(data, 0, 0);
	},
	
	position: function() {
		$$('.flyout-menu').hide();
		
		var coords = this.node.getCoordinates();

		this.object.show();
		
		this.menu.setPosition({
			x: coords.left + coords.width,
			y: coords.top + coords.height
		}).show();
	},
	
	show: function(node, url) {
		if (!this.dataMap[url]) {
			return false;
		}
		
		var data = this.dataMap[url];
		
		this.node = new Element(node);
		this.menu = $('flyout-' + data.id);

		if (this.menu) {
			
		} else if (data.children) {
			this.menu = this.buildMenu(this.object, data, true);
		}

		window.setTimeout(this.position.bind(this), this.options.delay);
	},
	
	buildMenu: function(parent, data, cache) {
		var div = new Element('div.flyout-menu'),
			ul = new Element('ul'),
			li,
			tag;
			
		if (cache) {
			div.set('id', 'flyout-' + data.id);
		}
			
		for (var i = 0, l = data.children.length, child; i < l; i++) {
			child = data.children[i];
			
			li = new Element('li');
			tag = new Element(data.url ? 'a' : 'span', {
				text: child.title,
				href: child.url
			});
			
			if (child.className) {
				li.addClass(child.className);
			}
			
			li.grab(tag).inject(ul);
			
			if (child.children) {
				this.buildMenu(li, child);
			}
		}
	
		div.grab(ul).inject(parent);
		
		return div;
	}.protect(),
	
	loadDataMap: function(data, index, depth) {
		data.id = depth + '' + index;
		
		this.dataMap[data.url] = data;

		if (data.children) {
			data.children.each(function(item, index) {
				this.loadDataMap(item, index, depth + 1);
			}.bind(this));
		}
	}.protect()
	
});

/**
 * All flyout instances loaded via factory().
 */
Titon.Flyout.instances = [];

/**
 * Easily create multiple tooltip instances.
 * 
 * @param query
 * @param url
 * @param options
 */
Titon.Flyout.factory = function(query, url, options) {
	var instance = new Titon.Flyout(query, url, options);
	
	Titon.Flyout.instances.push(instance);
	
	return instance;
};