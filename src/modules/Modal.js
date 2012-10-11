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
	elementClose: null,

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
	 *	draggable		- (boolean) Will enable dragging on the outer element
	 *	blackout		- (boolean) Will show a blackout when a modal is opened, and hide it when it is closed
	 *	fade			- (boolean) Will fade the modals in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	className		- (string) Class name to append to a modal when it is shown
	 *	showLoading		- (boolean) Will display the loading text while waiting for AJAX calls
	 *	getContent		- (string) Attribute to read the content from
	 *	getClose		- (string) CSS query to bind hide() events to inner content
	 *	delay			- (int) The delay in milliseconds before the modal shows
	 *	context			- (element) The element the modals will display in (defaults body)
	 *	onHide			- (function) Callback to trigger when a modal is hidden
	 *	onShow			- (function) Callback to trigger when a modal is shown
	 *	onPosition		- (function) Callback to trigger when a modal is positioned
	 *	contentElement	- (string) CSS query for the content element within the template
	 *	closeElement	- (string) CSS query for the close element within the template
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 */
	options: {
		draggable: false,
		blackout: false,
		fade: false,
		fadeDuration: 250,
		className: '',
		showLoading: true,
		getContent: 'data-modal',
		getClose: '.modal-close-button',
		delay: 0,
		context: null,
		onHide: null,
		onShow: null,
		onPosition: null,
		contentElement: '.modal-inner',
		closeElement: '.modal-close',
		template: '<div class="modal">' +
			'<div class="modal-inner"></div>' +
			'<a href="#close" class="modal-close"></a>' +
		'</div>'
	},

	/**
	 * Custom options per node.
	 */
	customOptions: {},

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
		this.elementClose = this.element.getElement(this.options.closeElement);

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
		var callback = this.listen.bind(this);

		$(this.options.context || document.body)
			.removeEvent('click:relay(' + query + ')', callback)
			.addEvent('click:relay(' + query + ')', callback);

		this.elementClose.addEvent('click', this.hide.bind(this));

		window.addEvent('keydown', function(e) {
			if (e.key === 'esc') {
				this.hide();
			}
		}.bind(this));
	},

	/**
	 * Hide the modal and reset relevant values.
	 */
	hide: function() {
		if (!this.isVisible) {
			return;
		}

		this.isVisible = false;
		this.node = null;

		if (this.customOptions.className !== this.options.className) {
			this.element.removeClass(this.customOptions.className);
		}

		this.customOptions = {};

		if (this.options.fade) {
			this.element.fadeOut(this.options.fadeDuration, function() {
				if (this.options.blackout) {
					this.blackout.hide();
				}
			}.bind(this));

		} else {
			this.element.hide();

			if (this.options.blackout) {
				this.blackout.hide();
			}
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
	 * Show the modal after fetching the content.
	 *
	 * @param {Element} node
	 * @param {object} options
	 */
	show: function(node, options) {
		node = new Element(node);
		options = Titon.mergeOptions(this.options, node.getOptions('modal') || options);

		this.node = node;
		this.customOptions = options;

		var target = this.node.get(options.getContent) || this.node.get('href');

		// Add custom classes
		this.element.addClass(options.className);

		// DOM element
		if (target.substr(0, 1) === '#') {
			this._position($(target.remove('#')).get('html'));

		// AJAX call
		} else {
			if (this.cache[target]) {
				this._position(this.cache[target]);

			} else {
				new Request({
					url: target,
					method: 'get',
					evalScripts: true,

					onSuccess: function(response) {
						this.cache[target] = response;
						this._position(response);
					}.bind(this),

					onRequest: function() {
						if (options.showLoading) {
							var html = new Element('div.modal-loading');
								html.set('html', Titon.msg.loading);

							this._position(html);

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
			}
		}

		this.fireEvent('show');
	},

	/**
	 * Position the modal in the center of the screen.
	 *
	 * @private
	 * @param {string|Element} content
	 */
	_position: function(content) {
		this.elementBody
			.set('html', content)
			.getElements(this.options.getClose).addEvent('click', this.hide.bind(this));

		this.element.position({
			relativeTo: document.body,
			position: 'center'
		});

		window.setTimeout(function() {
			if (this.options.blackout) {
				this.blackout.show();
			}

			if (this.options.fade) {
				this.element.fadeIn(this.options.fadeDuration);
			} else {
				this.element.show();
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