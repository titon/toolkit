/**
 * Titon: The Mootools UI Framework
 *
 * @copyright	Copyright 2006-2012, Titon
 * @license		http://opensource.org/licenses/mit-license.php - Licensed under the MIT License
 * @link		http://github.com/titon
 */

/**
 * Creates dynamic modals that will display above the content.
 *
 * @version	1.0.0
 * @uses	Titon
 * @uses	Titon.Blackout
 * @uses	Titon.Module
 * @uses	Core
 * @uses	More/Drag
 * @uses	More/Element.Position
 */
Titon.Modal = new Class({
	Extends: Titon.Module,

	/**
	 * Blackout instance if options.blackout is true.
	 */
	blackout: null,

	/**
	 * A cache of all AJAX calls, indexed by the URL.
	 */
	cache: {},

	/**
	 * Drag instance if options.drag is true.
	 */
	drag: null,

	/**
	 * DOM elements.
	 */
	elementBody: null,

	/**
	 * Is the modal currently visible?
	 */
	isVisible: false,

	/**
	 * Current node that activated the modal.
	 */
	node: null,

	/**
	 * Query selector used for modal activation.
	 */
	query: null,

	/**
	 * Default options.
	 *
	 *	ajax			- (boolean) The modal uses the target as an AJAX call
	 *	draggable		- (boolean) Will enable dragging on the outer element
	 *	blackout		- (boolean) Will show a blackout when a modal is opened, and hide it when it is closed
	 *	fade			- (boolean) Will fade the modals in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	className		- (string) Class name to append to a modal when it is shown
	 *	position		- (string) The position to display the modal on the page
	 *	showLoading		- (boolean) Will display the loading text while waiting for AJAX calls
	 *	getContent		- (string) Attribute to read the content from
	 *	delay			- (int) The delay in milliseconds before the modal shows
	 *	context			- (element) The element the modals will display in (defaults body)
	 *	onHide			- (function) Callback to trigger when a modal is hidden
	 *	onLoad			- (function) Callback to trigger when a modal content is loaded
	 *	onShow			- (function) Callback to trigger when a modal is shown through event
	 *	onPosition		- (function) Callback to trigger when a modal is positioned
	 *	contentElement	- (string) CSS query for the content element within the template
	 *	closeElement	- (string) CSS query for the close element within the template
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 */
	options: {
		ajax: true,
		draggable: false,
		blackout: false,
		fixed: true,
		fade: false,
		fadeDuration: 250,
		className: '',
		position: 'center',
		showLoading: true,
		getContent: 'data-modal',
		delay: 0,
		context: null,
		onHide: null,
		onLoad: null,
		onShow: null,
		onPosition: null,
		contentElement: '.modal-inner',
		closeElement: '.modal-close',
		closeEvent: '.modal-event-close',
		template: '<div class="modal">' +
			'<div class="modal-inner"></div>' +
			'<a href="#close" class="modal-close modal-event-close"></a>' +
		'</div>'
	},

	/**
	 * Initialize the modal be creating the DOM elements and setting default events.
	 *
	 * @param {string} query
	 * @param {object} options
	 */
	initialize: function(query, options) {
		this.parent(options);
		this.query = query;

		// Get elements
		this.elementBody = this.element.getElement(this.options.contentElement);

		// Set options
		if (this.options.className) {
			this.element.addClass(this.options.className);
		}

		if (this.options.draggable) {
			this.drag = new Drag(this.element, {
				onStart: function(element) {
					element.addClass(Titon.options.draggingClass);
				},
				onComplete: function(element) {
					element.removeClass(Titon.options.draggingClass);
				}
			});

			this.element.addClass(Titon.options.draggableClass);
		}

		if (this.options.blackout) {
			this.blackout = new Titon.Blackout();
			this.blackout.element.addEvent('click', this.hide.bind(this));
		}

		// Set events
		if (query) {
			var callback = this.listen.bind(this);

			$(this.options.context || document.body)
				.removeEvent('click:relay(' + query + ')', callback)
				.addEvent('click:relay(' + query + ')', callback);
		}

		window.addEvent('keydown', function(e) {
			if (e.key === 'esc') {
				this.hide();
			}
		}.bind(this));
	},

	/**
	 * Hide the modal and reset relevant values.
	 *
	 * @param {Event} e
	 */
	hide: function(e) {
		if (typeOf(e) === 'domevent') {
			e.stop();
		}

		if (!this.isVisible) {
			return;
		}

		var options = this.options,
			blackout = function() {
				if (this.options.blackout) {
					this.blackout.hide();
				}
			}.bind(this);

		this.isVisible = false;
		this.node = null;

		if (options.fade) {
			this.element.fadeOut(options.fadeDuration, blackout);

		} else {
			this.element.hide();
			blackout();
		}

		this.fireEvent('hide');
	},

	/**
	 * Event callback for modal click.
	 *
	 * @param {event} e
	 * @param {Element} node
	 */
	listen: function(e, node) {
		e.stop();

		this.show(node);
	},

	/**
	 * Load the modal content with a string.
	 *
	 * @param {string} string
	 */
	loadFromString: function(string) {
		this._position(string);

		this.fireEvent('load');
	},

	/**
	 * Load the modal content with a DOM element.
	 *
	 * @param {Element|string} element
	 */
	loadFromDom: function(element) {
		if (typeOf(element) === 'string' && element.substr(0, 1) === '#') {
			element = $(element.remove('#')).get('html');
		}

		this._position(element);

		this.fireEvent('load');
	},

	/**
	 * Load the modal content from an AJAX URL request.
	 *
	 * @param {string} url
	 */
	loadFromUrl: function(url) {
		if (this.cache[url]) {
			this._position(this.cache[url]);

			this.fireEvent('load');

			return;
		}

		new Request({
			url: url,
			method: 'get',
			evalScripts: true,

			onSuccess: function(response) {
				this.cache[url] = response;
				this._position(response);
			}.bind(this),

			onRequest: function() {
				this.fireEvent('load');

				if (this.options.showLoading) {
					this._position(new Element('div.modal-loading', { text: Titon.msg.loading }));

					// Decrease count since _position() is being called twice
					if (this.options.blackout) {
						this.blackout.decrease();
					}
				}
			}.bind(this),

			onFailure: function() {
				this.hide();
			}.bind(this)
		}).get();
	},

	/**
	 * Show the modal after loading the content.
	 *
	 * @param {Element|string} node
	 */
	show: function(node) {
		this.node = new Element(node);

		var options = Titon.mergeOptions(this.options, this.node.getOptions('modal')),
			content = this.node.get(options.getContent) || this.node.get('href');

		if (content.substr(0, 1) === '#') {
			this.loadFromDom(content);
		} else {
			this.loadFromUrl(content);
		}

		this.fireEvent('show');
	},

	/**
	 * Position the modal in the center of the screen.
	 *
	 * @private
	 * @param {Element|string} content
	 */
	_position: function(content) {
		this.elementBody.setHtml(content);

		this.element.getElements(this.options.closeEvent)
			.removeEvent('click')
			.addEvent('click', this.hide.bind(this));

		this.element.position({
			relativeTo: document.body,
			position: this.options.position,
			ignoreScroll: this.options.fixed
		});

		if (this.options.fixed) {
			this.element.setStyle('position', 'fixed');
		}

		window.setTimeout(function() {
			if (!this.element.isVisible()) {
				if (this.options.blackout) {
					this.blackout.show();
				}

				if (this.options.fade) {
					this.element.fadeIn(this.options.fadeDuration);
				} else {
					this.element.show();
				}
			}

			this.isVisible = true;
			this.fireEvent('position');
		}.bind(this), this.options.delay || 0);
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Modal.instances = {};

/**
 * Easily create multiple instances.
 *
 * @param {string} query
 * @param {object} options
 */
Titon.Modal.factory = function(query, options) {
	if (Titon.Modal.instances[query]) {
		return Titon.Modal.instances[query];
	}

	var instance = new Titon.Modal(query, options);

	Titon.Modal.instances[query] = instance;

	return instance;
};

/**
 * Hide all instances.
 */
Titon.Modal.hide = function() {
	Object.each(Titon.Modal.instances, function(modal) {
		modal.hide();
	});
};