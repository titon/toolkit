/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './template-component'
], function($, Toolkit, TemplateComponent) {

var CompositeComponent = Toolkit.CompositeComponent = TemplateComponent.extend({

    /** Cache of elements related to the component. */
    elements: {},

    /** Collection of nodes. */
    nodes: null,

    /** The container that holds each individual dynamic element. */
    wrapper: null,

    /**
     * Create an element from the `template` or `templateFrom` options.
     *
     * @param {jQuery} node
     * @param {Object} [options]
     * @returns {jQuery}
     */
    createElement: function(node, options) {
        options = this.inheritOptions(options || this.options, node);

        // Create template
        var template = TemplateComponent.prototype.createElement.call(this, options);

        // Move to wrapper
        if (this.wrapper) {
            template.appendTo(this.wrapper);
        }

        var id = node.data('toolkit.cid');

        return template
            .attr('id', this.id(id))
            .data('toolkit.cid', id);
    },

    /**
     * Create the elements wrapper.
     *
     * @return {jQuery}
     */
    createWrapper: function() {
        var options = this.options;

        return this.wrapper = this.render(options.wrapperTemplate)
            .addClass(Toolkit.buildTemplate(options.wrapperClass))
            .attr('id', this.id('wrapper'))
            .appendTo('body');
    },

    /**
     * Hide all the cached and built elements.
     */
    hideElements: function() {
        $.each(this.elements, function(i, el) {
            $(el).conceal();
        });
    },

    /**
     * Attempt to find and return an element by a unique composite ID.
     * Each element is unique per node. If the element does not exist, create it.
     *
     * @param {jQuery} node
     * @param {Function} [callback]   - Callback to trigger once an element is created
     * @returns {jQuery}
     */
    loadElement: function(node, callback) {
        var elements = this.elements,
            el,
            id = $(node).cache('toolkit.cid', function() {
                return Math.random().toString(32).substr(2);
            });

        if (elements[id]) {
            el = elements[id];
        } else {
            el = elements[id] = this.createElement(node);

            if ($.type(callback) === 'function') {
                callback.call(this, el);
            }
        }

        return this.element = el;
    },

    /**
     * {@inheritdoc}
     */
    doDestroy: function() {
        var key = this.keyName;

        // Remove instances
        if (this.nodes) {
            this.nodes.removeData('toolkit.' + key);

            delete Toolkit.cache[key + ':' + this.nodes.selector];
        }

        // Hide elements
        this.hideElements();

        // Remove wrapper
        if (this.wrapper) {
            this.wrapper.remove();
        }
    },

    /**
     * Event handler for toggling an element through click or hover events.
     *
     * @param {jQuery.Event} e
     * @private
     */
    onShowToggle: function(e) {
        var node = $(e.currentTarget),
            element,
            isNode = (this.node && this.node.is(node)),
            cid = node.data('toolkit.cid');

        // Set the current element based on the nodes composite ID
        if (cid && this.elements[cid]) {
            element = this.elements[cid];
        } else {
            element = this.element;
        }

        if (element && element.is(':shown')) {

            // Touch devices should pass through on second click
            if (Toolkit.isTouch) {
                if (!isNode || this.node.prop('tagName').toLowerCase() !== 'a') {
                    e.preventDefault();
                }

                // Non-touch devices
            } else {
                e.preventDefault();
            }

            if (isNode) {
                // Second click should close it
                if (this.options.mode === 'click') {
                    this.hide();
                }

                // Exit if the same node so it doesn't re-open
                return;
            }

        } else {
            e.preventDefault();
        }

        this.show(node);
    }

}, {
    wrapperClass: '',
    wrapperTemplate: '<div class="toolkit-plugin"></div>'
});

return CompositeComponent;
});
