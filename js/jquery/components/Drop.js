/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Drop = Toolkit.Component.extend(function(nodes, options) {
    var events;

    this.component = 'Drop';
    this.version = '1.2.0';
    this.options = options = this.setOptions(options);
    this.element = null; // Current drop
    this.node = null; // Opened the drop
    this.nodes = nodes = $(nodes);
    this.events = events = {};

    // Initialize events
    events['clickout .' + Toolkit.vendor + 'drop,' + nodes.selector] = 'hide';
    events[options.mode + ' ' + nodes.selector] = 'onShow';

    this.enable();
    this.fireEvent('init');
}, {

    /**
     * Hide the opened element and remove active state.
     */
    hide: function() {
        var element = this.element;

        if (element && element.is(':shown')) {
            element.conceal();
            this.node.removeClass('is-active');

            this.fireEvent('hide', [element, this.node]);
        }
    },

    /**
     * Open the target element and apply active state.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        this.element.reveal();

        this.node = node = $(node);
        this.node.addClass('is-active');

        this.fireEvent('show', [this.element, node]);
    },

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @private
     * @param {jQuery.Event} e
     */
    onShow: function(e) {
        e.preventDefault();

        var node = $(e.target),
            options = this.options,
            target = this.readValue(node, options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        // Hide previous drops
        if (options.hideOpened && this.node && !this.node.is(node)) {
            this.hide();
        }

        this.element = $(target);
        this.node = node;

        if (!this.element.is(':shown')) {
            this.show(node);
        } else {
            this.hide();
        }
    }

}, {
    mode: 'click',
    getTarget: 'data-drop',
    hideOpened: true
});

/**
 * Defines a component that can be instantiated through drop().
 */
Toolkit.create('drop', function(options) {
    return new Toolkit.Drop(this, options);
}, true);