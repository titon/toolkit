/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Showcase = new Class({
	Extends: Titon.Component,
	Binds: ['next', 'prev'],

	captionElement: null,
	itemsElement: null,
	tabsElement: null,
	prevElement: null,
	nextElement: null,

	/** List of items data to populate the showcase with **/
	items: [],

	/** The current and previous shown indices */
	previousIndex: 0,
	currentIndex: 0,

	/** Blackout instance if options.blackout is true */
	blackout: null,

	options: {
		blackout: true,
		getCategory: 'data-showcase',
		getSource: 'href',
		getTitle: 'title',
		captionElement: '.showcase-caption',
		itemsElement: '.showcase-items',
		tabsElement: '.showcase-tabs',
		prevElement: '.showcase-prev',
		nextElement: '.showcase-next',
		closeEvent: '.showcase-event-close',
		prevEvent: '.showcase-event-prev',
		nextEvent: '.showcase-event-next',
		template: '<div class="showcase">' +
			'<div class="showcase-inner">' +
				'<ul class="showcase-items"></ul>' +
				'<ol class="showcase-tabs"></ol>' +
				'<div class="showcase-caption"></div>' +
				'<a href="javascript:;" class="showcase-prev showcase-event-prev"><span class="icon-chevron-sign-left"></span></a>' +
				'<a href="javascript:;" class="showcase-next showcase-event-next"><span class="icon-chevron-sign-right"></span></a>' +
				'<button type="button" class="close showcase-event-close">' +
					'<span class="x">&times;</span>' +
				'</button>' +
			'</div>' +
		'</div>'
	},

	initialize: function(query, options) {
		this.parent(options);
		this.bindTo(query);
		this.createElement();

		options = this.options;

		// Get elements
		this.captionElement = this.element.getElement(options.captionElement);
		this.itemsElement = this.element.getElement(options.itemsElement);
		this.tabsElement = this.element.getElement(options.tabsElement);
		this.prevElement = this.element.getElement(options.prevElement);
		this.nextElement = this.element.getElement(options.nextElement);

		// Blackout
		if (this.options.blackout) {
			this.blackout = new Titon.Blackout();
			this.blackout.element.addEvent('click', this._hide);
		}

		// Set events
		this.disable().enable();

		window.addEvent('keydown', function(e) {
			if (e.key === 'esc') {
				this.hide();
			}
		}.bind(this));

		this.element
			.addEvent('click:relay(' + this.options.closeEvent + ')', this._hide)
			.addEvent('click:relay(' + this.options.nextEvent + ')', this.next)
			.addEvent('click:relay(' + this.options.prevEvent + ')', this.prev);
	},

	/**
	 * Hide the showcase and reset relevant values.
	 */
	hide: function() {
		this.parent(function() {
			if (this.options.blackout) {
				this.blackout.hide();
			}

			this.itemsElement
				.removeProperty('style')
				.getElements('li').removeClass('show');
		}.bind(this));
	},

	jump: function(index) {
		index = index || this.currentIndex;

		if (index >= this.items.length) {
			index = 0;
		} else if (index < 0) {
			index = this.items.length - 1;
		}

		// Save state
		this.previousIndex = this.currentIndex;
		this.currentIndex = index;

		// Resize based on media
		var items = this.itemsElement.getElements('li'),
			size = items[index].measure(function() {
				return this.getSize();
			});

		this.itemsElement.setStyles({
			width: size.x,
			height: size.y
		});

		// Preload image
		var img = new Image();
			img.src = this.items[index].image;
			img.onload =function() {
				items.removeClass('show');
				items[index].addClass('show');
			};
	},

	/**
	 * Go to the next item.
	 */
	next: function() {
		this.jump(this.currentIndex + 1);
	},

	/**
	 * Go to the previous item.
	 */
	prev: function() {
		this.jump(this.currentIndex - 1);
	},

	show: function(node) {
		this.node = node;
		this.currentIndex = this.previousIndex = 0;

		var options = this.options,
			read = this.getValue,
			category = read(node, options.getCategory),
			items = [];

		// Multiple items based on category
		if (category) {
			for (var i = 0, n; n = this.nodes[i]; i++) {
				if (n === node) {
					this.currentIndex = i;
				}

				if (read(n, options.getCategory) === category) {
					items.push({
						title: read(n, options.getTitle),
						category: category,
						image: read(n, options.getSource)
					});
				}
			}

		// Single item
		} else {
			items.push({
				title: read(node, options.getTitle),
				category: category,
				image: read(node, options.getSource)
			});
		}

		this._buildItems(items);
		this._position();
		this.jump();
	},

	_buildItems: function(items) {
		this.items = items;
		this.itemsElement.empty();

		for (var li, item, i = 0; item = items[i]; i++) {
			li = new Element('li');

			if (item.image) {
				li.grab(new Element('img.media').set('src', item.image));
			}

			li.inject(this.itemsElement);
		}

		if (items.length > 1) {
			this.nextElement.show();
			this.prevElement.show();
			this.tabsElement.show();
		} else {
			this.nextElement.hide();
			this.prevElement.hide();
			this.tabsElement.hide();
		}
	}.protect(),

	_position: function() {
		if (!this.isVisible()) {
			if (this.options.blackout) {
				this.blackout.show();
			}

			this.element.reveal();
		}

		this.fireEvent('show');
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Showcase.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} [options]
 * @return {Titon.Showcase}
 */
Titon.Showcase.factory = function(query, options) {
	if (Titon.Showcase.instances[query]) {
		return Titon.Showcase.instances[query];
	}

	var instance = new Titon.Showcase(query, options);

	Titon.Showcase.instances[query] = instance;

	return instance;
};

})();