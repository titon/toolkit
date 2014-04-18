/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.OffCanvas = Toolkit.Component.extend(function(element, options) {
    this.component = 'OffCanvas';
    this.version = '1.4.0';
    this.element = element = $(element).addClass(vendor + 'off-canvas').attr('role', 'complementary').conceal();
    this.options = options = this.setOptions(options, element);

    var events = {}, animation = options.animation;

    // Touch devices cannot use squish
    if (Toolkit.isTouch && animation === 'squish') {
        options.animation = animation = 'push';
    }

    // Cannot have multiple non-overlayed or squished sidebars open
    if (animation !== 'on-top' && animation !== 'squish') {
        options.hideOthers = true;
    }

    // Setup container
    this.container = element.parents('.' + vendor + 'canvas').addClass(animation);

    // Determine the side
    this.side = element.hasClass(vendor + 'off-canvas--left') ? 'left' : 'right';
    this.opposite = (this.side === 'left') ? 'right' : 'left';

    // Initialize events
    events['ready document'] = 'onReady';

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

    this.events = events;

    this.initialize();
}, {

    /**
     * Hide the sidebar and reset the container.
     */
    hide: function() {
        this.container
            .removeClass('move-' + this.opposite);

        this.element
            .conceal()
            .removeClass('is-expanded')
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
            element = this.element,
            container = this.container;

        if (options.hideOthers) {
            container.find('.' + vendor + 'off-canvas').each(function() {
                var sidebar = $(this);

                if (!sidebar.is(element) && sidebar.hasClass('is-expanded')) {
                    sidebar.toolkit('offCanvas', 'hide');
                }
            });
        }

        container
            .addClass('move-' + this.opposite);

        element
            .reveal()
            .addClass('is-expanded')
            .aria('expanded', true);

        this.fireEvent('show');
    },

    /**
     * Toggle between show and hide states.
     */
    toggle: function() {
        if (this.element.hasClass('is-expanded')) {
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
        if (!this.options.openOnLoad) {
            return;
        }

        var sidebar = this.element,
            inner = this.container.find('.' + vendor + 'on-canvas'),
            transClass = 'no-transition';

        sidebar.addClass(transClass);
        inner.addClass(transClass);

        this.show();

        // Transitions will still occur unless we place in a timeout
        setTimeout(function() {
            sidebar.removeClass(transClass);
            inner.removeClass(transClass);
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
    animation: 'push',
    openOnLoad: false,
    hideOthers: true
});

Toolkit.create('offCanvas', function(options) {
    return new Toolkit.OffCanvas(this, options);
});