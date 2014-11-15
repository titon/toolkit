/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    './component',
    '../events/clickout',
    '../extensions/shown-selector'
], function($, Toolkit) {

Toolkit.Drop = Toolkit.Component.extend({
    name: 'Drop',
    version: '2.0.0',

    /**
     * Initialize the drop.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        this.options = this.setOptions(options);

        // Set events
        this.addEvents([
            ['clickout', 'document', 'hide', this.ns('menu')],
            ['clickout', 'document', 'hide', '{selector}'],
            ['{mode}', 'document', 'onShow', '{selector}']
        ]);

        // Initialize
        this.initialize();
    },

    /**
     * Hide element when destroying.
     */
    destructor: function() {
        this.hide();

        // Hide all other menus as well
        $(this.ns('menu')).conceal();
    },

    /**
     * Hide the opened element and remove active state.
     */
    hide: function() {
        var element = this.element;

        if (element && element.is(':shown')) {
            this.fireEvent('hiding');

            element.conceal();

            this.node
                .aria('toggled', false)
                .removeClass('is-active');

            this.fireEvent('hidden', [element, this.node]);
        }
    },

    /**
     * Open the target menu and apply active state.
     *
     * @param {jQuery} menu
     * @param {jQuery} node
     */
    show: function(menu, node) {
        this.fireEvent('showing');

        this.element = menu = $(menu).reveal();

        this.node = node = $(node)
            .aria('toggled', true)
            .addClass('is-active');

        this.fireEvent('shown', [menu, node]);
    },

    /**
     * When a node is clicked, grab the target from the attribute.
     * Validate the target element, then either display or hide.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShow: function(e) {
        e.preventDefault();

        var node = $(e.currentTarget),
            options = this.options,
            target = this.readValue(node, options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            return;
        }

        // Hide previous drops
        if (options.hideOpened && this.node && !this.node.is(node)) {
            this.hide();
        }

        var menu = $(target);

        if (!menu.is(':shown')) {
            this.show(menu, node);

        } else {
            this.element = menu;
            this.hide();
        }
    }

}, {
    mode: 'click',
    getTarget: 'data-drop',
    hideOpened: true
});

Toolkit.create('drop', function(options) {
    return new Toolkit.Drop(this, options);
}, true);

return Toolkit;
});