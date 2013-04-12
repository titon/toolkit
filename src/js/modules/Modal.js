/**
 * @copyright	Copyright 2010-2013, The Titon Project
 * @license		http://opensource.org/licenses/bsd-license.php
 * @link		http://titon.io
 */

(function() {
	'use strict';

/**
 * Creates dynamic modals that will display above the content.
 */
Titon.Modal = new Class({
	Extends: Titon.Module,
	Binds: ['_submit'],

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
	 *	showLoading		- (boolean) Will display the loading text while waiting for AJAX calls
	 *	getContent		- (string) Attribute to read the content from
	 *	delay			- (int) The delay in milliseconds before the modal shows
	 *	contentElement	- (string) CSS query for the content element within the template
	 *	closeElement	- (string) CSS query for the close element within the template
	 *	closeEvent		- (string) CSS query to bind hide events to
	 *	submitEvent		- (string) CSS query to bind submit events to
	 *	onSubmit		- (function) Callback to trigger when a modal form is submitted
	 */
	options: {
		ajax: true,
		draggable: false,
		blackout: true,
		fixed: true,
		showLoading: true,
		getContent: 'data-modal',
		delay: 0,
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
			this.blackout.element.addEvent('click', this._hide);
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
		this.parent(function() {
			if (this.options.blackout) {
				this.blackout.hide();
			}

			this.element.hide();
		}.bind(this));
	},

	/**
	 * Show the modal with the specific content.
	 * If a node is passed, grab the modal AJAX URL.
	 * If content is passed, display it immediately.
	 *
	 * @param {Element} node
	 * @param {String|Element} content
	 */
	show: function(node, content) {
		var options = this.options;

		// Get content
		if (content) {
			options.ajax = false;

		} else if (node) {
			options.ajax = true;
			content = this.getValue(node, options.getContent) || node.get('href');
		}

		if (!content) {
			return;
		}

		this.node = node;

		if (options.ajax) {
			if (this.cache[content]) {
				this._position(this.cache[content]);
			} else {
				this.requestData(content);
			}
		} else {
			this._position(content);
		}
	},

	/**
	 * Position the modal in the center of the screen.
	 *
	 * @private
	 * @param {String|Element} content
	 */
	_position: function(content) {
		// AJAX is currently loading
		if (content === true) {
			return;
		}

		this.elementBody.setHtml(content);

		// Set events
		this.element.getElements(this.options.closeEvent)
			.removeEvent('click')
			.addEvent('click', this._hide);

		this.element.getElements(this.options.submitEvent)
			.removeEvent('click')
			.addEvent('click', this._submit);

		// Position
		this.element.position({
			position: 'center',
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
	},

	/**
	 * Submit the form within the modal if it exists and re-render the modal with the response.
	 *
	 * @param {Event} e
	 */
	_submit: function(e) {
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
				this._position(this._errorTemplate());
			}.bind(this)
		}).send();
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

})();