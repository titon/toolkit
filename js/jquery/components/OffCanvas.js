/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.OffCanvas = Toolkit.Component.extend(function(element, options) {
    this.component = 'OffCanvas';
    this.version = '1.4.0';
    this.element = element = $(element).attr('role', 'complementary');
    this.options = options = this.setOptions(options, element);

    // Setup container
    this.container = $(options.context || 'body').addClass(vendor + 'off-canvas-container');

    // Determine the side
    this.side = element.hasClass(vendor + 'off-canvas--left') ? 'right' : 'left';

    // Initialize events
    this.events = {};

    if (options.selector) {
        this.events['click document ' + options.selector] = 'toggle';
    }

    this.initialize();

    // Open the sidebar immediately
    // Disable transitions so page doesn't jump
    if (options.openOnLoad) {
        var transClass = 'no-transition';

        this.element.addClass(transClass);
        this.container.addClass(transClass);

        this.show();

        // Transitions will still occur unless we place in a timeout
        setTimeout(function() {
            this.element.removeClass(transClass);
            this.container.removeClass(transClass);
        }.bind(this), 1);
    }
}, {

    /**
     * Hide the sidebar and reset the container.
     */
    hide: function() {
        if (!this.options.overlay) {
            this.container.removeClass('push-' + this.side);
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
     */
    show: function() {
        if (!this.options.overlay) {
            this.container.addClass('push-' + this.side);
        }

        this.element
            .reveal()
            .aria('expanded', true);

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
    }

}, {
    selector: '',
    overlay: false,
    openOnLoad: false
});

Toolkit.create('offCanvas', function(options) {
    return new Toolkit.OffCanvas(this, options);
});