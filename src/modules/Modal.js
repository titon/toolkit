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
 * @uses	More/Class.Binds
 * @uses	More/Drag
 * @uses	More/Element.Position
 */
Titon.Modal = new Class({
	Extends: Titon.Module,
	Binds: ['_listen'],

	/**
	 * Blackout instance if options.blackout is true.
	 */
	blackout: null,

	/**
	 * Drag instance if options.drag is true.
	 */
	drag: null,

	/**
	 * Body DOM element.
	 */
	elementBody: null,

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
	 *	errorMessage	- (string) Error message when AJAX calls fail
	 *	loadingMessage	- (string) Loading message while waiting for AJAX calls
	 *	contentElement	- (string) CSS query for the content element within the template
	 *	closeElement	- (string) CSS query for the close element within the template
	 *	closeEvent		- (string) CSS query to bind hide events to
	 *	submitEvent		- (string) CSS query to bind submit events to
	 *	template		- (string) HTML string template that will be converted to DOM nodes
	 *	onHide			- (function) Callback to trigger when a modal is hidden
	 *	onShow			- (function) Callback to trigger when a modal is shown
	 *	onPosition		- (function) Callback to trigger when a modal is positioned
	 *	onSubmit		- (function) Callback to trigger when a modal form is submitted
	 */
	options: {
		ajax: true,
		draggable: false,
		blackout: true,
		fixed: true,
		fade: false,
		fadeDuration: 250,
		className: '',
		position: 'center',
		showLoading: true,
		getContent: 'data-modal',
		delay: 0,
		context: null,
		errorMessage: Titon.msg.error,
		loadingMessage: Titon.msg.loading,
		contentElement: '.modal-inner',
		closeElement: '.modal-close',
		closeEvent: '.modal-event-close',
		submitEvent: '.modal-event-submit',
		template: '<div class="modal">' +
			'<div class="modal-inner"></div>' +
			'<a href="javascript:;" class="modal-close modal-event-close"></a>' +
		'</div>',

		// Events
		onHide: null,
		onShow: null,
		onPosition: null,
		onSubmit: null
	},

	/**
	 * Initialize the modal be creating the DOM elements and setting default events.
	 *
	 * @param {String} query
	 * @param {Object} options
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
		this.disable().enable();

		window.addEvent('keydown', function(e) {
			if (e.key === 'esc') {
				Titon.Modal.hide();
			}
		});
	},

	/**
	 * Disable modal events.
	 *
	 * @return {Titon.Modal}
	 */
	disable: function() {
		if (this.query) {
			$(this.options.context || document.body).removeEvent('click:relay(' + this.query + ')', this._listen);
		}

		return this;
	},

	/**
	 * Enable modal events.
	 *
	 * @return {Titon.Modal}
	 */
	enable: function() {
		if (this.query) {
			$(this.options.context || document.body).addEvent('click:relay(' + this.query + ')', this._listen);
		}

		return this;
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

		if (!this.isVisible()) {
			return;
		}

		this.node = null;

		var blackout = function() {
			if (this.options.blackout) {
				this.blackout.hide();
			}
		}.bind(this);

		if (this.options.fade) {
			this.element.fadeOut(this.options.fadeDuration, blackout);

		} else {
			this.element.hide();
			blackout();
		}

		this.fireEvent('hide');
	},

	/**
	 * Show the modal with the specific content.
	 * If a node is passed, grab the modal AJAX URL.
	 *
	 * @param {Element} node
	 * @param {String|Element} content
	 * @param {Object|boolean} options
	 */
	show: function(node, content, options) {
		if (options === true) {
			options = { ajax: true };
		} else if (!options) {
			options = { ajax: this.options.ajax };
		}

		options = Titon.mergeOptions(this.options, options);

		// Get content
		if (node && !content) {
			content = this.getValue(node, options.getContent) || node.get('href');
			options.ajax = true;
		}

		if (!content) {
			return;
		}

		this.node = node;

		// AJAX
		if (options.ajax) {
			if (this.cache[content]) {
				this._position(this.cache[content]);

			} else {
				new Request({
					url: content,
					method: 'get',
					evalScripts: true,
					onSuccess: function(response) {
						this.cache[content] = response;
						this._position(response);
					}.bind(this),
					onRequest: function() {
						this.cache[content] = true;

						if (options.showLoading) {
							this._position(new Element('div.modal-loading', {
								text: options.loadingMessage
							}));

							// Decrease count since _position() is being called twice
							if (this.options.blackout) {
								this.blackout.decrease();
							}
						}
					}.bind(this),
					onFailure: function() {
						delete this.cache[content];

						this._position(new Element('div.modal-error', {
							text: options.errorMessage
						}));
					}.bind(this)
				}).get();
			}

		// Element, String
		} else {
			this._position(content);
		}

		this.fireEvent('show');
	},

	/**
	 * Submit the form within the modal if it exists and re-render the modal with the response.
	 *
	 * @param {Event} e
	 */
	submit: function(e) {
		e.stop();

		var button = e.target,
			form = button.getParent('form');

		if (!form) {
			return;
		}

		new Request({
			url: form.get('action'),
			method: form.get('method').toUpperCase(),
			data: form.toQueryString(),
			evalScripts: true,
			onSuccess: function(response) {
				this._position(response);
			}.bind(this),
			onFailure: function() {
				this._position(new Element('div.modal-error', {
					text: this.options.errorMessage
				}));
			}.bind(this)
		}).send();

		this.fireEvent('submit', button);
	},

	/**
	 * Callback for delegation events.
	 *
	 * @private
	 * @param {Event} e
	 * @param {Element} node
	 */
	_listen: function(e, node) {
		e.stop();

		this.show(node);
	},

	/**
	 * Position the modal in the center of the screen.
	 *
	 * @private
	 * @param {String|Element} content
	 */
	_position: function(content) {
		this.elementBody.setHtml(content);

		// Set events
		this.element.getElements(this.options.closeEvent)
			.removeEvent('click')
			.addEvent('click', this.hide.bind(this));

		this.element.getElements(this.options.submitEvent)
			.removeEvent('click')
			.addEvent('click', this.submit.bind(this));

		// Position
		this.element.position({
			relativeTo: document.body,
			position: this.options.position,
			ignoreScroll: this.options.fixed
		});

		if (this.options.fixed) {
			this.element.setStyle('position', 'fixed');
		}

		window.setTimeout(function() {
			if (!this.isVisible()) {
				if (this.options.blackout) {
					this.blackout.show();
				}

				if (this.options.fade) {
					this.element.fadeIn(this.options.fadeDuration);
				} else {
					this.element.show();
				}
			}

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
 * @param {String} query
 * @param {Object} options
 * @return {Titon.Modal}
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