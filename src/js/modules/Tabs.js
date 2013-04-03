/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

/**
 * Provides tabbed support to an element containing navigation tabs and sections.
 * Each time a tab is clicked, the section with the same ID as the tab href will be displayed.
 *
 * @uses	Titon
 * @uses	Titon.Module
 * @uses	Core
 * @uses	More/Class.Binds
 */
Titon.Tabs = new Class({
	Extends: Titon.Module,
	Binds: ['_listen'],

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
	 *	ajax			- (boolean) Will load the href as an ajax call when applicable
	 *	fade			- (boolean) Should the sections fade in
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	defaultIndex	- (int) Index of the tab/section to display by default
	 *	persistState	- (boolean) Will persist the last tab clicked between page loads
	 *	cookie			- (string) The key used in the cookie name
	 *	cookieDuration	- (int) The length the cookie will last (in days)
	 *	errorMessage	- (string) Error message when AJAX calls fail
	 *	loadingMessage	- (string) Loading message while waiting for AJAX calls
	 *	tabsElement		- (string) The CSS query to grab the tab elements
	 *	sectionsElement	- (string) The CSS query to grab the section elements
	 *	template		- (string) Do not use an HTML template
	 *	onShow			- (function) Callback to trigger when a section is shown
	 *	onHide			- (function) Callback to trigger when all sections are hidden
	 */
	options: {
		ajax: true,
		fade: false,
		fadeDuration: 600,
		mode: 'click',
		defaultIndex: 0,
		persistState: false,
		cookie: null,
		cookieDuration: 30,
		errorMessage: Titon.msg.error,
		loadingMessage: Titon.msg.loading,
		tabsElement: 'nav a',
		sectionsElement: 'section',
		template: false,

		// Events
		onShow: null,
		onHide: null
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

		this.parent(options);
		this.query = query;

		// Get elements
		this.tabs = this.element.getElements(this.options.tabsElement);
		this.tabs.each(function(tab, index) {
			tab.set('data-tabs-index', index).removeClass(Titon.options.activeClass);
		}.bind(this));

		this.sections = this.element.getElements(this.options.sectionsElement);
		this.sections.hide();

		// Set events
		this.disable().enable();

		// Trigger default tab to display
		var index = Number.from(Cookie.read('titon.tabs.' + this.options.cookie) || this.options.defaultIndex);

		this.show(index);
	},

	/**
	 * Disable tab events.
	 *
	 * @return {Titon.Tabs}
	 */
	disable: function() {
		this.tabs.removeEvent((this.options.mode === 'click') ? 'click' : 'mouseover', this._listen);

		return this;
	},

	/**
	 * Enable tab events.
	 *
	 * @return {Titon.Tabs}
	 */
	enable: function() {
		this.tabs.addEvent((this.options.mode === 'click') ? 'click' : 'mouseover', this._listen);

		return this;
	},

	/**
	 * Hide all sections and trigger event.
	 */
	hide: function() {
		this.sections.hide();

		this.fireEvent('hide', this.node);
	},

	/**
	 * Show the content based on the tab. Can either pass an integer as the index in the collection,
	 * or pass an element object for a tab in the collection.
	 *
	 * @param {Element|int} tab
	 */
	show: function(tab) {
		if (typeOf(tab) === 'number') {
			tab = this.tabs[tab] || null;
		}

		if (!tab) {
			return;
		}

		// Set default tab
		if (!this.node) {
			this.node = tab;
		}

		var className = Titon.options.activeClass,
			target = tab.get('data-tabs-index'),
			url = tab.get('href'),
			section = this.sections[target];

		// Load content with AJAX
		if (url && !url.contains('#') && this.options.ajax && !this.cache[url]) {
			new Request({
				url: url,
				method: 'get',
				evalScripts: true,
				onSuccess: function(response) {
					this.cache[url] = true;
					section.setHtml(response);
				}.bind(this),
				onRequest: function() {
					section.setHtml(new Element('div.tabs-loading', {
						text: this.options.loadingMessage
					}));
				}.bind(this),
				onFailure: function() {
					section.setHtml(new Element('div.tabs-error', {
						text: this.options.errorMessage
					})).addClass(Titon.options.failedClass);
				}.bind(this)
			}).get();
		}

		// Toggle tabs
		this.tabs.removeClass(className);
		tab.addClass(className);

		// Toggle sections
		this.hide();

		if (this.options.fade) {
			section.fadeIn(this.options.fadeDuration)
		} else {
			section.show();
		}

		// Persist the state using a cookie
		if (this.options.persistState) {
			Cookie.write('titon.tabs.' + this.options.cookie, tab.get('data-tabs-index'), {
				duration: this.options.cookieDuration
			});
		}

		// Track
		this.previousIndex = this.currentIndex;
		this.currentIndex = tab.get('data-tabs-index');

		this.fireEvent('show', tab);

		// Set current node
		this.node = tab;
	},

	/**
	 * Event callback for tab element click.
	 *
	 * @param {Event} e
	 */
	_listen: function(e) {
		e.stop();

		this.show(e.target);
	}

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