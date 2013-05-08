/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

Titon.Tabs = new Class({
	Extends: Titon.Module,

	/**
	 * Collection of content sections.
	 */
	sections: [],

	/**
	 * Collection of tabs (anchor links).
	 */
	tabs: [],

	/**
	 * The current and previous shown indices.
	 */
	previousIndex: 0,
	currentIndex: 0,

	/**
	 * Default options.
	 *
	 *	ajax			- (bool) Will load the href as an ajax call when applicable
	 *	collapsible		- (bool) Hide the section if the tab is clicked again
	 *	defaultIndex	- (int) Index of the tab/section to display by default
	 *	persistState	- (bool) Will persist the last tab clicked between page loads
	 *	preventDefault	- (bool) Prevent the default action from triggering for tabs
	 *	cookie			- (string) The key used in the cookie name
	 *	cookieDuration	- (int) The length the cookie will last (in days)
	 *	tabsElement		- (string) The CSS query to grab the tab elements
	 *	sectionsElement	- (string) The CSS query to grab the section elements
	 */
	options: {
		ajax: true,
		collapsible: false,
		defaultIndex: 0,
		persistState: false,
		preventDefault: true,
		cookie: null,
		cookieDuration: 30,
		tabsElement: 'nav a',
		sectionsElement: 'section'
	},

	/**
	 * Initialize Tabs by storing the query, gathering the elements and binding events.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		options = options || {};
		options.cookie = (options.cookie || query).camelCase();
		options.templateFrom = query;
		options.template = false;

		this.parent(query, options);

		// Get elements
		this.tabs = this.element.getElements(this.options.tabsElement);
		this.tabs.each(function(tab, index) {
			tab.set('data-tabs-index', index).removeClass(Titon.options.activeClass);
		});

		this.sections = this.element.getElements(this.options.sectionsElement);
		this.sections.hide();

		// Set events
		this.disable().enable();

		this.fireEvent('init');

		// Trigger default tab to display
		var index = Number.from(Cookie.read('titon.tabs.' + this.options.cookie) || this.options.defaultIndex);

		this.jump(index);
	},

	/**
	 * Hide all sections and trigger event.
	 */
	hide: function() {
		this.sections.hide();

		this.fireEvent('hide', this.node);
	},

	/**
	 * Jump to a specific tab via index.
	 *
	 * @param {Number} index
	 */
	jump: function(index) {
		if (this.tabs[index]) {
			this.show(this.tabs[index]);
		}
	},

	/**
	 * Show the content based on the tab. Can either pass an integer as the index in the collection,
	 * or pass an element object for a tab in the collection.
	 *
	 * @param {Element} tab
	 */
	show: function(tab) {
		var activeClass = Titon.options.activeClass,
			loadingClass = Titon.options.loadingClass,
			failedClass = Titon.options.failedClass,
			index = tab.get('data-tabs-index'),
			section = this.sections[index],
			url = tab.get('href');

		// Load content with AJAX
		if (this.options.ajax && url && !url.contains('#') && !this.cache[url]) {
			new Request({
				url: url,
				method: 'get',
				evalScripts: true,
				onSuccess: function(response) {
					this.cache[url] = true;

					section.setHtml(response)
						.removeClass(loadingClass);
				}.bind(this),

				onRequest: function() {
					section.setHtml(this._loadingTemplate())
						.addClass(loadingClass);
				}.bind(this),

				onFailure: function() {
					section.setHtml(this._errorTemplate())
						.removeClass(loadingClass)
						.addClass(failedClass);
				}.bind(this)
			}).get();
		}

		// Toggle tabs
		this.tabs.removeClass(activeClass);

		// Toggle sections
		if (index === this.currentIndex && this.options.collapsible) {
			if (this.isVisible(section)) {
				this.hideElement(section);

			} else {
				tab.addClass(activeClass);
				this.showElement(section);
			}
		} else {
			this.hide();

			tab.addClass(activeClass);
			this.showElement(section);
		}

		// Persist the state using a cookie
		if (this.options.persistState) {
			Cookie.write('titon.tabs.' + this.options.cookie, index, {
				duration: this.options.cookieDuration
			});
		}

		// Track
		this.previousIndex = this.currentIndex;
		this.currentIndex = index;

		this.fireEvent('show', tab);

		// Set current node
		this.node = tab;
	},

	/**
	 * Event callback for tab element click.
	 *
	 * @private
	 * @param {Event} e
	 */
	_show: function(e) {
		if (this.options.preventDefault) {
			e.preventDefault();
		}

		this.show(e.target);
	},

	/**
	 * Toggle activation events on and off.
	 *
	 * @private
	 * @return {Titon.Tabs}
	 */
	_toggleEvents: function(on) {
		if (!this.query) {
			return this;
		}

		var event = (this.options.mode === 'click') ? 'click' : 'mouseover';

		if (on) {
			this.tabs.addEvent(event, this._show);
		} else {
			this.tabs.removeEvent(event, this._show);
		}

		if (event === 'mouseover' && this.options.preventDefault) {
			this.tabs.addEvent('click', function(e) {
				e.preventDefault();
			});
		}

		return this;
	}.protect()

});

/**
 * All instances loaded via factory().
 */
Titon.Tabs.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {String} query
 * @param {Object} options
 * @return {Titon.Tabs}
 */
Titon.Tabs.factory = function(query, options) {
	if (Titon.Tabs.instances[query]) {
		return Titon.Tabs.instances[query];
	}

	var instance = new Titon.Tabs(query, options);

	Titon.Tabs.instances[query] = instance;

	return instance;
};

})();