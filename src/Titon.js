
var Titon = {

	version: '',
	
	UI: {},
	
	config: {
		prefix: 'titon-'
	},
	
	setup: function(config) {
		Titon.config = Object.merge(Titon.config, config);
	},
	
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