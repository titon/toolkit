/**
 * Titon: The Mootools UI Framework
 *
 * @copyright	Copyright 2006-2012, Titon
 * @license		http://opensource.org/licenses/mit-license.php - Licensed under the MIT License
 * @link		http://github.com/titon
 */

/**
 * Provides tabbed support to an element containing navigation tabs and sections.
 * Each time a tab is clicked, the section with the same ID as the tab href will be displayed.
 *
 * {{{
 * 		<div id="tabs">
 *			<nav>
 *				<ul>
 *					<li><a href="#tab-1">Tab 1</a></li>
 *					<li><a href="#tab-2">Tab 2</a></li>
 *				</ul>
 *			</nav>
 *
 *			<section id="tab-1"></section>
 *			<section id="tab-2"></section>
 * 		</div>
 *
 * 		<script>
 *			var tabs = Titon.Tabs.factory('tabs', {});
 * 		</script>
 * }}}
 *
 * @version	1.0.0
 * @uses	Titon
 * @uses	Titon.Module
 * @uses	Core
 */
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
	 *	ajax			- (boolean) Will load the href as an ajax call when applicable
	 *	fade			- (boolean) Should the sections fade in
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	mode			- (string) Either "hover" or "click"
	 *	activeClass		- (string) Class name appended to the active tab
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
	 */
	options: {
		ajax: true,
		fade: false,
		fadeDuration: 600,
		mode: 'click',
		activeClass: Titon.options.activeClass,
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
		onShow: null
	},

	/**
	 * Initialize Tabs by storing the query, gathering the elements and binding events.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		options.cookie = (options.cookie || query).camelCase();
		options.templateFrom = query;

		this.parent(options);
		this.query = query;

		// Get elements
		this.tabs = this.element.getElements(this.options.tabsElement);
		this.tabs.each(function(tab, index) {
			tab.set('data-tabs-index', index).removeClass(this.options.activeClass);
		}.bind(this));

		this.sections = this.element.getElements(this.options.sectionsElement);
		this.sections.hide();

		// Set events
		this.tabs.addEvent((this.options.mode === 'click') ? 'click' : 'mouseover', this._listen.bind(this));

		// Trigger default tab to display
		var index = Number.from(Cookie.read('titon.tabs.' + this.options.cookie) || this.options.defaultIndex);

		this.show(index);
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

		var className = this.options.activeClass,
			target = tab.get('data-tabs-index'),
			url = tab.get('href'),
			section = this.sections[target];

		// Load content with AJAX
		if (url && !url.contains('#') && this.options.ajax) {
			if (!this.cache[url]) {
				new Request({
					url: url,
					method: 'get',
					evalScripts: true,
					onSuccess: function(response) {
						this.cache[url] = response;
						section.setHtml(response);
					}.bind(this),
					onRequest: function() {
						if (this.options.showLoading) {
							section.setHtml(new Element('div.tabs-loading', {
								text: this.options.loadingMessage
							}));
						}
					}.bind(this),
					onFailure: function() {
						section.setHtml(new Element('div.tabs-error', {
							text: this.options.errorMessage
						}));
					}.bind(this)
				}).get();
			}
		}

		// Toggle tabs
		this.tabs.removeClass(className);

		tab.addClass(className);

		// Toggle sections
		this.sections.hide();

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