/**
 * Titon: The Mootools UI/Utility Framework
 *
 * @copyright	Copyright 2010+, Titon
 * @link		http://github.com/titon
 * @license		http://opensource.org/licenses/bsd-license.php (BSD License)
 */

/**
 * @todo
 *
 * @version	0.2
 * @uses	Titon
 * @uses	Core
 * @uses	More/Drag
 * @uses	More/Element.Position
 */
Titon.Modal = new Class({
	Implements: [Events, Options],

	/**
	 * Query selector used for modal activation.
	 */
	query: null,

	/**
	 * DOM elements.
	 */
	element: null,
	elementBody: null,

	/**
	 * Current node that activated the modal.
	 */
	node: null,

	/**
	 * Drag instance if options.drag is true.
	 */
	drag: null,

	/**
	 * A cache of all AJAX calls, indexed by the URL.
	 */
	cache: {},

	/**
	 * Is the tooltip currently visible?
	 */
	isVisible: false,

	/**
	 * Default options.
	 *
	 *	draggable		- (bool) Will enable dragging on the outer element
	 *	blackout		- (bool) Will show a blackout when a modal is opened, and hide it when it is closed
	 *	fade			- (bool) Will fade the modals in and out
	 *	fadeDuration	- (int) Fade duration in milliseconds
	 *	className		- (string) Class name to append to a tooltip when it is shown
	 *	showLoading		- (bool) Will display the loading text while waiting for AJAX calls
	 *	contentQuery	- (string) Attribute to read the content from
	 *	closeQuery		- (string) CSS query to bind hide() events to inner content
	 *	delay			- (int) The delay in milliseconds before the modal shows
	 *	context			- (element) The element the tooltips will display in (defaults body)
	 *	onHide			- (function) Callback to trigger when a modal is hidden
	 *	onShow			- (function) Callback to trigger when a modal is shown
	 *	onPosition		- (function) Callback to trigger when a modal is positioned
	 */
	options: {
		draggable: false,
		blackout: false,
		fade: false,
		fadeDuration: 250,
		className: '',
		showLoading: true,
		contentQuery: 'data-modal',
		closeQuery: '.modal-close-button',
		delay: 0,
		context: document.body,
		onHide: null,
		onShow: null,
		onPosition: null
	},

	/**
	 * @todo
	 *
	 * @param {string} query
	 * @param {object} options
	 */
	initialize: function(query, options) {
		this.setOptions(options);
		this.query = query;

		var outer = new Element('div.' + Titon.options.prefix + 'modal'),
			inner = new Element('div.modal-inner'),
			close = new Element('a.modal-close'),
			listenCallback = this.listen.bind(this);

		// Set options
		if (this.options.className) {
			outer.addClass(this.options.className);
		}

		if (this.options.draggable) {
			this.drag = new Drag(outer, {
				onStart: function(element) {
					element.addClass(Titon.options.draggingClass);
				},
				onComplete: function(element) {
					element.removeClass(Titon.options.draggingClass);
				}
			});
		}

		// Assign elements and events
		outer.grab(inner).grab(close).inject(document.body);

		this.element = outer;
		this.elementBody = inner;

		$(this.options.context)
			.removeEvent('click:relay(' + query + ')', listenCallback)
			.addEvent('click:relay(' + query + ')', listenCallback);

		close.addEvent('click', this.hide.bind(this));

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

		if (this.options.fade) {
			this.element.fadeOut(this.options.fadeDuration, function() {
				if (this.options.blackout) {
					Titon.hideBlackout();
				}
			}.bind(this));

		} else {
			this.element.hide();

			if (this.options.blackout) {
				Titon.hideBlackout();
			}
		}

		this.fireEvent('hide');
	},

	/**
	 * Event callback for modal click.
	 *
	 * @param {event} e
	 * @param {object} node
	 * @return {boolean}
	 */
	listen: function(e, node) {
		e.stop();

		this.show(node);

		return false;
	},

	/**
	 * Position the modal in the center of the screen.
	 *
	 * @param {string|Element} content
	 */
	position: function(content) {
		this.elementBody
			.set('html', content)
			.getElements(this.options.closeQuery).addEvent('click', this.hide().bind(this));

		this.element.position({
			relativeTo: document.body,
			position: 'center'
		});

		window.setTimeout(function() {
			if (this.options.blackout) {
				Titon.showBlackout();
			}

			if (this.options.fade) {
				this.element.fadeIn(this.options.fadeDuration);
			} else {
				this.element.show();
			}

			this.isVisible = true;
			this.fireEvent('position');
		}.bind(this), this.options.delay || 0);
	},

	/**
	 * Show the modal after fetching the content.
	 *
	 * @param {object} node
	 */
	show: function(node) {
		if (!node) {
			return;
		}

		this.node = new Element(node);

		var target = this.node.get(this.options.contentQuery) || this.node.get('href');

		// DOM element
		if (target.substr(0, 1) === '#') {
			this.position($(target.remove('#')).get('html'));

		// AJAX call
		} else {
			if (this.cache[target]) {
				this.position(this.cache[target]);

			} else {
				new Request({
					url: target,
					method: 'get',
					evalScripts: true,

					onSuccess: function(response) {
						this.cache[target] = response;
						this.position(response);
					}.bind(this),

					onRequest: function() {
						if (this.options.showLoading) {
							var html = new Element('div.modal-loading');
								html.set('html', Titon.msg.loading);

							this.position(html);
						}
					}.bind(this),

					onFailure: function() {
						this.hide();
					}.bind(this)
				}).get();
			}
		}

		this.fireEvent('show');
	}

});

/**
 * All instances loaded via factory().
 */
Titon.Modal.instances = {};

/**
 * Easily create multiple Modal instances.
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
 * Hide all Tooltip instances.
 */
Titon.Modal.hide = function() {
	Object.each(Titon.Modal.instances, function(modal) {
		modal.hide();
	});
};