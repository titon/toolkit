/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Showcase = new Class({
	Extends: Titon.Component,
	Binds: ['next', 'prev', '_jump'],

	/** Elements within the showcase */
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

	/**
	 * Default options.
	 *
	 *	blackout		- (bool) Will show a blackout when the showcase is opened, and hide it when it is closed
	 *	transition		- (int) The length of CSS transition animations
	 *	getCategory		- (string) The attribute to grab the category from
	 *	getImage		- (string) The attribute to grab the image path from
	 *	getTitle		- (string) The attribute to grab the title caption from
	 *	itemsElement	- (string) CSS query for the items list element within the template
	 *	tabsElement		- (string) CSS query for the tabs list element within the template
	 *	prevElement		- (string) CSS query for the prev button element within the template
	 *	nextElement		- (string) CSS query for the next button element within the template
	 *	closeEvent		- (string) CSS query to bind hide events to
	 *	jumpEvent		- (string) CSS query to bind jump events to
	 *	prevEvent		- (string) CSS query to bind prev events to
	 *	nextEvent		- (string) CSS query to bind next events to
	 */
	options: {
		blackout: true,
		transition: 300,
		getCategory: 'data-showcase',
		getImage: 'href',
		getTitle: 'title',
		itemsElement: '.showcase-items',
		tabsElement: '.showcase-tabs',
		prevElement: '.showcase-prev',
		nextElement: '.showcase-next',
		closeEvent: '.showcase-event-close',
		jumpEvent: '.showcase-event-jump',
		prevEvent: '.showcase-event-prev',
		nextEvent: '.showcase-event-next',
		template: '<div class="showcase">' +
			'<div class="showcase-inner">' +
				'<ul class="showcase-items"></ul>' +
				'<ol class="showcase-tabs"></ol>' +
				'<a href="javascript:;" class="showcase-prev showcase-event-prev"><span class="icon-chevron-sign-left"></span></a>' +
				'<a href="javascript:;" class="showcase-next showcase-event-next"><span class="icon-chevron-sign-right"></span></a>' +
				'<button type="button" class="close showcase-event-close">' +
					'<span class="x">&times;</span>' +
				'</button>' +
			'</div>' +
		'</div>',

		// Events
		onJump: null
	},

	/**
	 * Initialize the showcase, its elements and events.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		this.parent(options);
		this.bindTo(query);
		this.createElement();

		options = this.options;

		// Get elements
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
			if (this.isVisible()) {
				switch (e.key) {
					case 'esc':		this.hide(); break;
					case 'up':		this.jump(0); break;
					case 'down':	this.jump(-1); break;
					case 'left':	this.prev(); break;
					case 'right':	this.next(); break;
				}
			}
		}.bind(this));

		this.element
			.addEvent('click:relay(' + this.options.closeEvent + ')', this._hide)
			.addEvent('click:relay(' + this.options.nextEvent + ')', this.next)
			.addEvent('click:relay(' + this.options.prevEvent + ')', this.prev)
			.addEvent('click:relay(' + this.options.jumpEvent + ')', this._jump);

		this.fireEvent('init');
	},

	/**
	 * Hide the showcase and reset relevant values.
	 */
	hide: function() {
		this.parent(function() {
			if (this.options.blackout) {
				this.blackout.hide();
			}

			this.element.removeClass('is-single');

			this.itemsElement
				.removeProperty('style')
				.getElements('li').removeClass('show');
		}.bind(this));
	},

	/**
	 * Jump to a specific item indicated by the index number.
	 * If the index is too large, jump to the beginning.
	 * If the index is too small, jump to the end.
	 *
	 * @param {Number} index
	 */
	jump: function(index) {
		if (index >= this.items.length) {
			index = 0;
		} else if (index < 0) {
			index = this.items.length - 1;
		}

		var options = this.options,
			element = this.element,
			list = this.itemsElement,
			listItems = list.getElements('li'),
			listItem = listItems[index],
			items = this.items,
			item = items[index],
			loadingClass = Titon.options.loadingClass,
			activeClass = Titon.options.activeClass;

		// Save state
		this.previousIndex = this.currentIndex;
		this.currentIndex = index;

		// Update tabs
		if (this.tabsElement) {
			var listTabs = this.tabsElement.getElements('a');

			listTabs.removeClass(activeClass);
			listTabs[index].addClass(activeClass);
		}

		// Fade out previous item
		listItems.removeClass('show');

		// Image already exists
		if (listItem.hasAttribute('data-width')) {

			// Resize the showcase to the image size
			list.setStyles({
				width: listItem.get('data-width').toInt(),
				height: listItem.get('data-height').toInt()
			});

			// Reveal the image after animation
			setTimeout(function() {
				listItem.addClass('show');
			}, options.transition);

		// Create image and animate
		} else {
			element.addClass(loadingClass);

			// Preload image
			var img = new Image();
				img.src = item.image;

			// Resize showcase after image loads
			img.onload = function() {
				list.setStyles({
					width: this.width,
					height: this.height
				});

				// Cache the width and height
				listItem
					.set('data-width', this.width)
					.set('data-height', this.height);

				// Create the caption
				if (item.title) {
					listItem.grab(new Element('div.showcase-caption').set('html', item.title));
				}

				// Reveal the image after animation
				setTimeout(function() {
					element.removeClass(loadingClass);
					listItem.addClass('show').grab(img);
				}, options.transition);
			};
		}

		this.fireEvent('jump', index);
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

	/**
	 * Reveal the showcase after scraping for items data.
	 * Will scrape data from the activating node.
	 * If a category exists, scrape data from multiple nodes.
	 *
	 * @param {Element} node
	 */
	show: function(node) {
		this.node = node;
		this.currentIndex = this.previousIndex = 0;
		this.element.addClass(Titon.options.loadingClass);

		var options = this.options,
			read = this.getValue,
			category = read(node, options.getCategory),
			items = [],
			index = 0;

		// Multiple items based on category
		if (category) {
			for (var i = 0, x = 0, n; n = this.nodes[i]; i++) {
				if (read(n, options.getCategory) === category) {
					if (n === node) {
						index = x;
					}

					items.push({
						title: read(n, options.getTitle),
						category: category,
						image: read(n, options.getImage)
					});

					x++;
				}
			}

		// Single item
		} else {
			items.push({
				title: read(node, options.getTitle),
				category: category,
				image: read(node, options.getImage)
			});
		}

		this._buildItems(items);
		this._position();
		this.jump(index);
	},

	/**
	 * Build the list of items and tabs based on the generated data.
	 * Determine which elements to show and bind based on the data.
	 *
	 * @param {Array} items
	 * @private
	 */
	_buildItems: function(items) {
		this.items = items;
		this.itemsElement.empty();
		this.tabsElement.empty();

		for (var li, a, item, i = 0; item = items[i]; i++) {
			li = new Element('li');
			li.inject(this.itemsElement);

			a = new Element('a')
				.set('class', this.options.jumpEvent.substr(1))
				.set('href', 'javascript:;')
				.set('data-index', i);

			li = new Element('li');
			li.inject(this.tabsElement).grab(a);
		}

		if (items.length <= 1) {
			this.element.addClass('is-single');
		}
	}.protect(),

	/**
	 * Event handler for jumping between items.
	 *
	 * @param {DOMEvent} e
	 * @private
	 */
	_jump: function(e) {
		e.stop();

		this.jump(e.target.get('data-index') || 0);
	},

	/**
	 * Position the element in the middle of the screen.
	 *
	 * @private
	 */
	_position: function() {
		if (!this.isVisible()) {
			if (this.options.blackout) {
				this.blackout.show();
			}

			this.element.reveal();
		}

		this.fireEvent('show');
	}.protect()

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