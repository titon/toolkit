/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Carousel = new Class({
	Extends: Titon.Component,
	Binds: ['next', 'prev', 'jump', 'pause', 'play'],

	/** Is the carousel paused? */
	paused: false,

	/** Slides and parent container. */
	slidesWrapper: null,
	slides: null,

	/** Tabs and parent container. */
	tabsWrapper: null,
	tabs: null,

	/** Previous and next buttons. */
	prevButton: null,
	nextButton: null,

	/** The current and previous shown indices. */
	previousIndex: 0,
	currentIndex: 0,

	options: {
		defaultIndex: 0,
		pauseOnHover: true,
		slidesElement: '.carousel-slides',
		slideElement: '.carousel-slide',
		tabsElement: '.carousel-tabs',
		tabElement: 'a',
		nextElement: '.carousel-next',
		prevElement: '.carousel-prev',
		template: false
	},

	initialize: function(id, options) {
		this.parent(options);
		this.setElement(id);

		if (!this.element) {
			return;
		}

		// Get elements
		this.slidesWrapper = this.element.getElement(this.options.slidesElement);
		this.slides = this.slidesWrapper.getElements(this.options.slideElement);

		this.tabsWrapper = this.element.getElement(this.options.tabsElement);
		this.tabs = this.tabsWrapper.getElements(this.options.tabElement);

		this.nextButton = this.element.getElement(this.options.nextElement);
		this.prevButton = this.element.getElement(this.options.prevElement);

		// Disable carousel if too low of slides
		if (this.slides.length <= 1) {
			this.tabsWrapper.hide();
			this.nextButton.hide();
			this.prevButton.hide();

			return;
		}

		console.log(this);

		this.disable().enable();
	},

	jump: function(index) {
		console.log('jump');
	},

	next: function() {
		console.log('next');
	},

	pause: function() {
		this.element.addClass('is-paused');
		this.paused = true;

		console.log('pause');
	},

	play: function() {
		this.element.removeClass('is-paused');
		this.paused = false;

		console.log('play');
	},

	prev: function() {
		console.log('prev');
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

		if (this.options.pauseOnHover) {
			this.element[method]('mouseenter', this.pause);
			this.element[method]('mouseleave', this.play);
		}

		if (this.tabs) {
			this.tabs[method]('click', this.jump);
		}

		if (this.nextButton) {
			this.nextButton[method]('click', this.next);
		}

		if (this.prevButton) {
			this.prevButton[method]('click', this.prev);
		}

		if (on) {
			this.play();
		} else {
			this.pause();
		}

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