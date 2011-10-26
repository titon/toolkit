
var Titon = {

	version: '',
	
	UI: {},
	
	config: {
		prefix: 'titon-'
	},
	
	setup: function(config) {
		Titon.config = Object.merge(Titon.config, config);
	}
	
};

/*Element.implement({
	
	show: function() {
		this.setStyle('display','');
	},

	hide: function() {
		this.setStyle('display','none');
	}
	
});*/