/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.OffCanvas = Toolkit.Component.extend(function(element, options) {
    var events = {};

    this.component = 'OffCanvas';
    this.version = '1.4.0';
    this.element = element = $(element).addClass(vendor + 'off-canvas').attr('role', 'complementary');
    this.options = options = this.setOptions(options, element);

    // Setup container
    this.container = $(options.context || 'body').addClass(vendor + 'off-canvas-container');

    // Body cannot be pushed, so do a move instead
    if (this.container.is('body')) {
        options.push = false;
    }

    // Determine the side
    this.side = element.hasClass(vendor + 'off-canvas--left') ? 'left' : 'right';
    this.opposite = (this.side === 'left') ? 'right' : 'left';

    // Initialize events
    if (this.side === 'left') {
        events['swipeleft element'] = 'hide';
        events['swiperight container'] = 'onSwipe';
    } else {
        events['swipeleft container'] = 'onSwipe';
        events['swiperight element'] = 'hide';
    }

    if (options.selector) {
        events['click document ' + options.selector] = 'toggle';
    }

    if (options.openOnLoad) {
        events['ready document'] = 'onReady';
    }

    this.events = events;

    this.initialize();
}, {

    /**
     * Hide the sidebar and reset the container.
     */
    hide: function() {
        var options = this.options;

        if (!options.overlay) {
            this.container.removeClass((options.push ? 'push' : 'move') + '-' + this.opposite);
        }

        this.element
            .removeClass('show') // Using conceal() doesn't trigger the transition
            .aria({
                hidden: true,
                expanded: false
            });

        this.fireEvent('hide');
    },

    /**
     * Show the sidebar and squish the container to make room for the sidebar.
     * If hideOthers is true, hide other open sidebars.
     */
    show: function() {
        var options = this.options,
            element = this.element;

        if (options.hideOthers) {
            $('.' + vendor + 'off-canvas').each(function() {
                var sidebar = $(this);

                if (!sidebar.is(element) && sidebar.hasClass('show')) {
                    sidebar.toolkit('offCanvas', 'hide');
                }
            });
        }

        if (!options.overlay) {
            if (options.push) {
                this.container.addClass('push-' + this.opposite);

            } else {
                element.reveal();
                this.container.addClass('move-' + this.opposite);
            }
        }

        element.aria('expanded', true);

        this.fireEvent('show');
    },

    /**
     * Toggle between show and hide states.
     */
    toggle: function() {
        if (this.element.hasClass('show')) {
            this.hide();
        } else {
            this.show();
        }
    },

    /**
     * On page load, immediately display the sidebar.
     * Remove transitions from the sidebar and container so there is no page jumping.
     * Also disable `hideOthers` so multiple sidebars can be displayed on load.
     *
     * @private
     */
    onReady: function() {
        var element = this.element,
            container = this.container,
            options = this.options,
            transClass = 'no-transition',
            oldHide = options.hideOthers;

        element.addClass(transClass);
        container.addClass(transClass);
        options.hideOthers = false;

        this.show();

        // Transitions will still occur unless we place in a timeout
        setTimeout(function() {
            element.removeClass(transClass);
            container.removeClass(transClass);
            options.hideOthers = oldHide;
        }, 1);
    },

    /**
     * When swiping on the container, don't trigger a show if we are trying to hide a sidebar.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onSwipe: function(e) {
        e.preventDefault();

        var target = $(e.target),
            sideClass = '.' + vendor + 'off-canvas';

        if (target.is(sideClass) || target.parents(sideClass).length) {
            return;
        }

        this.show();
    }

}, {
    selector: '',
    overlay: false,
    push: true,
    openOnLoad: false,
    hideOthers: true
});

Toolkit.create('offCanvas', function(options) {
    return new Toolkit.OffCanvas(this, options);
});