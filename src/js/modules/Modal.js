/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

"use strict";

/**
 * Creates dynamic modals that will display above the content.
 *
 * @todo	Refactor fixed positioning
 */
Titon.Modal = new Class({
	Extends: Titon.Module,

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
	 *	fixed			- (boolean) Will position the modal in the center of the page regardless of scrolling
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
		position: 'center',
		showLoading: true,
		getContent: 'data-modal',
		delay: 0,
		errorMessage: Titon.msg.error,
		loadingMessage: Titon.msg.loading,
		contentElement: '.modal-inner',
		closeElement: '.modal-close',
		closeEvent: '.modal-event-close',
		submitEvent: '.modal-event-submit',
		template: '<div class="modal">' +
			'<div class="modal-inner"></div>' +
			'<button type="button" class="modal-close modal-event-close">' +
				'<span class="x">&times;</span>' +
			'</button>' +
		'</div>',

		// Events
		onSubmit: null
	},

	/**
	 * Initialize the modal be creating the DOM elements and setting default events.
	 *
	 * @param {String} query
	 * @param {Object} options
	 */
	initialize: function(query, options) {
		this.parent(query, options);

		// Get elements
		this.elementBody = this.element.getElement(this.options.contentElement);

		// Draggable
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

		// Blackout
		if (this.options.blackout) {
			this.blackout = new Titon.Blackout();
			this.blackout.element.addEvent('click', this.hide);
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
	 * Hide the modal and reset relevant values.
	 */
	hide: function() {
		if (!this.isVisible()) {
			return;
		}

		var blackout = function() {
			if (this.options.blackout) {
				this.blackout.hide();
			}

			this.element.hide();
		}.bind(this);

		if (this.options.fade) {
			this.element.fadeOut(this.options.fadeDuration, blackout);
		} else {
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
			options = { ajax: false };
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

							this.element.addClass(Titon.options.loadingClass);

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

						this.element.addClass(Titon.options.failedClass);
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

		this.fireEvent('submit', button);

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
		if (content === true) {
			return;
		}

		this.elementBody.setHtml(content);
		this.element.removeClass(Titon.options.loadingClass);

		// Set events
		this.element.getElements(this.options.closeEvent)
			.removeEvent('click')
			.addEvent('click', this.hide.bind(this));

		this.element.getElements(this.options.submitEvent)
			.removeEvent('click')
			.addEvent('click', this.submit.bind(this));

		// Position
		var position = this.options.position;

		this.element.position({
			position: position,
			edge: position,
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

			this.fireEvent('show');
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