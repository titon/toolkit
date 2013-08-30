/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Carousel = new Class({
	Extends: Titon.Component,
	Binds: ['next', 'prev', 'start', 'stop', '_cycle', '_jump', '_resize'],

	/** Is the carousel stopped? */
	stopped: false,

	/** Slides and parent container. */
	slidesWrapper: null,
	slides: [],

	/** Slide dimensions */
	slideWidth: 0,
	slideHeight: 0,

	/** Tabs and parent container. */
	tabsWrapper: null,
	tabs: [],

	/** Previous and next buttons. */
	prevButton: null,
	nextButton: null,

	/** The current and previous shown indices. */
	previousIndex: 0,
	currentIndex: 0,

	/** Cycle timer */
	timer: null,

	/**
	 * Default options.
	 */
	options: {
		animation: 'slide',
		duration: 5000,
		stopOnHover: true,
		slidesElement: '.carousel-slides',
		slideElement: 'li',
		tabsElement: '.carousel-tabs',
		tabElement: 'a',
		nextElement: '.carousel-next',
		prevElement: '.carousel-prev',
		template: false
	},

	/**
	 * Initialize Carousel by storing the query, gathering the elements and binding events.
	 *
	 * @param {String} id
	 * @param {Object} [options]
	 */
	initialize: function(id, options) {
		this.parent(options);
		this.setElement(id);

		if (!this.element) {
			return;
		}

		options = this.options;

		if (options.animation) {
			this.element.addClass(options.animation);
		}

		// Get elements
		this.slidesWrapper = this.element.getElement(options.slidesElement);

		if (this.slidesWrapper) {
			this.slides = this.slidesWrapper.getElements(options.slideElement);
		}

		this.tabsWrapper = this.element.getElement(options.tabsElement);

		if (this.tabsWrapper) {
			this.tabs = this.tabsWrapper.getElements(options.tabElement);
		}

		this.nextButton = this.element.getElement(options.nextElement);
		this.prevButton = this.element.getElement(options.prevElement);

		// Disable carousel if too low of slides
		if (this.slides.length <= 1) {
			this.tabsWrapper.hide();
			this.nextButton.hide();
			this.prevButton.hide();

			return;
		}

		// Set some sizes for responsiveness
		switch (options.animation) {
			case 'fade':
				this.slides[0].reveal();
			break;
			case 'slide':
				this.slidesWrapper.setStyle('width', (this.slides.length * 100) + '%');
				this.slides.setStyle('width', (100 / this.slides.length) + '%');
			break;
		}

		// Store some data in the elements
		this.tabs.forEach(function(tab, index) {
			tab.set('data-index', index);
		});

		// Set events
		this.disable().enable();

		this.fireEvent('init');
	},
	/**
	 * Go to the slide indicated by the index number.
	 * If the index is too large, jump to the beginning.
	 * If the index is too small, jump to the end.
	 *
	 * @param {Number} index
	 */
	jump: function(index) {
		if (index >= this.slides.length) {
			index = 0;
		} else if (index < 0) {
			index = this.slides.length - 1;
		}

		// Save state
		this.previousIndex = this.currentIndex;
		this.currentIndex = index;

		// Update tabs
		if (this.tabs.length) {
			var activeClass = Titon.options.activeClass;

			this.tabs.removeClass(activeClass);
			this.tabs[index].addClass(activeClass);
		}

		// Animate!
		switch (this.options.animation) {
			case 'fade':
				// Don't use conceal() as it causes the animation to flicker
				this.slides.removeClass('show');
				this.slides[index].reveal();
			break;
			case 'slide-up':
				// Animating top property doesn't work with percentages
				this.slidesWrapper.setStyle('top', -(index * this.slideHeight) + 'px');
			break;
			default:
				this.slidesWrapper.setStyle('left', -(index * 100) + '%');
			break;
		}
	},

	/**
	 * Go to the next slide.
	 */
	next: function() {
		this.jump(this.currentIndex + 1);
	},

	/**
	 * Go to the previous slide.
	 */
	prev: function() {
		this.jump(this.currentIndex - 1);
	},

	/**
	 * Start the carousel.
	 */
	start: function() {
		this.element.removeClass('is-stopped');
		this.stopped = false;
	},

	/**
	 * Stop the carousel.
	 */
	stop: function() {
		this.element.addClass('is-stopped');
		this.stopped = true;
	},

	/**
	 * Event handler for cycling between slides.
	 * Will stop cycling if carousel is stopped.
	 *
	 * @private
	 */
	_cycle: function() {
		if (!this.slideWidth || !this.slideHeight) {
			this._resize();
		}

		// Don't cycle if the carousel has stopped
		if (!this.stopped) {
			this.next();
		}
	},

	/**
	 * Event handler for jumping between slides.
	 *
	 * @param {DOMEvent} e
	 * @private
	 */
	_jump: function(e) {
		e.stop();

		this.jump(e.target.get('data-index') || 0);
	},

	/**
	 * Cache sizes once the carousel starts or when browser is resized.
	 * We need to defer this to allow image loading.
	 *
	 * @private
	 */
	_resize: function() {
		var size = this.slides[0].measure(function() {
			return this.getSize();
		});

		this.slideWidth = size.x;
		this.slideHeight = size.y;

		// Set height since slides are absolute positioned
		if (this.options.animation !== 'slide') {
			this.slidesWrapper.setStyle('height', size.y + 'px');
		}
	},

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.Tabs}
	 */
	_toggleEvents: function(on) {
		if (!this.element) {
			return this;
		}

		var method = on ? 'addEvent' : 'removeEvent';

		if (this.options.stopOnHover) {
			this.element[method]('mouseenter', this.stop);
			this.element[method]('mouseleave', this.start);
		}

		if (this.tabs.length) {
			this.tabs[method]('click', this._jump);
		}

		if (this.nextButton) {
			this.nextButton[method]('click', this.next);
		}

		if (this.prevButton) {
			this.prevButton[method]('click', this.prev);
		}

		if (on) {
			this.start();
		} else {
			this.stop();
		}

		window.addEvent('resize', this._resize);

		clearInterval(this.timer);
		this.timer = setInterval(this._cycle, this.options.duration);

		return this;
	}.protect()

});

/**
 * All instances loaded via factory().
 */
Titon.Carousel.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} id
 * @param {Object} [options]
 * @return {Titon.Carousel}
 */
Titon.Carousel.factory = function(id, options) {
	if (Titon.Carousel.instances[id]) {
		return Titon.Carousel.instances[id];
	}

	var instance = new Titon.Carousel(id, options);

	Titon.Carousel.instances[id] = instance;

	return instance;
};

})();