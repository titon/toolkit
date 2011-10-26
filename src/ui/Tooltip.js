
Titon.UI.Tooltip = new Class({
	
	node: null,
	
	cache: {},
	
	config: {
		isAjax: true,
		className: '',
		location: 'topRight'
	},
	
	isVisible: false,
	
	initialize: function(query, config) {
		document.body.addEvent('mouseover:relay(' + query + ')', this.listen);
		
		var outer = new Element('div.' + Titon.config.prefix + 'tooltip'),
			inner = new Element('div.tooltip-inner'),
			head = new Element('div.tooltip-head'),
			body = new Element('div.tooltip-body');
			
		inner.grab(head).grab(body);
		outer.grab(inner).inject( document.body );

		this.node = outer;
		this.config = Object.merge(this.config, config);
	},
	
	listen: function(e) {
		//this.show('ass');
		console.log(this);
	},
	
	show: function(node, content) {
		console.log(node);
		
		// Do an AJAX call using content as the URL
		if (this.config.isAjax) {
			// do ajax call
			// check cache
			
		// Copy the content found in the referenced ID
		} else if (content.substr(0, 1) === '#') {
			
		// Probably a string
		} else {
			
		}
	},
	
	hide: function() {
		this.isVisible = false;
		this.node.hide();
	},
	
	position: function() {
		
	},
	
	followMouse: function() {
		
	}.protect(),
	
	topLeft: function() {
		
	}.protect(),
	
	topCenter: function() {
		
	}.protect(),
	
	topRight: function() {
		
	}.protect(),
	
	middleLeft: function() {
		
	}.protect(),
	
	middleCenter: function() {
		
	}.protect(),
	
	middleRight: function() {
		
	}.protect(),
	
	bottomLeft: function() {
		
	}.protect(),
	
	bottomCenter: function() {
		
	}.protect(),
	
	bottomRight: function() {
		
	}.protect(),
	
	checkViewport: function() {
		
	}.protect()
	
});