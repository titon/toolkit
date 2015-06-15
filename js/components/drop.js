/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './composite-component',
    '../events/clickout',
    '../extensions/shown-selector'
], function($, Toolkit, CompositeComponent) {

var Drop = Toolkit.Drop = CompositeComponent.extend({
    name: 'Drop',
    version: '2.1.0',

    /**
     * Initialize the drop.
     *
     * @param {jQuery} nodes
     * @param {Object} [options]
     */
    constructor: function(nodes, options) {
        this.nodes = $(nodes);
        this.setOptions(options);

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
     * Find the menu for the current node.
     *
     * @param {jQuery} node
     */
    createElement: function(node) {
        var target = this.readValue(node, this.options.getTarget);

        if (!target || target.substr(0, 1) !== '#') {
            throw new Error('Drop menu ' + target + ' does not exist');
        }

        return $(target);
    },

    /**
     * Hide the opened menu and reset the nodes active state.
     */
    hide: function() {
        var element = this.element,
            node = this.node;

        // Clickout check
        if (!element && !node) {
            return;
        }

        this.fireEvent('hiding', [element, node]);

        element.conceal();

        node
            .aria('toggled', false)
            .removeClass('is-active');

        this.fireEvent('hidden', [element, node]);
    },

    /**
     * Open the target menu and apply active state to the node.
     *
     * @param {jQuery} node
     */
    show: function(node) {
        this.node = node = $(node);

        var element = this.loadElement(node);

        this.fireEvent('showing', [element, node]);

        element.reveal();

        node
            .aria('toggled', true)
            .addClass('is-active');

        this.fireEvent('shown', [element, node]);
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

        // Hide previous drops
        this.hide();

        // Toggle the menu
        var node = $(e.currentTarget),
            menu = this.loadElement(node);

        if (!menu.is(':shown')) {
            this.show(node);

        } else {
            this.hide();
        }
    }

}, {
    mode: 'click',
    getTarget: 'data-drop'
});

Toolkit.createPlugin('drop', function(options) {
    return new Drop(this, options);
}, true);

return Drop;
});
