/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../toolkit',
    './component'
], function($, Toolkit, Component) {

var TemplateComponent = Toolkit.TemplateComponent = Component.extend({

    /**
     * Create an element from the `template` or `templateFrom` options.
     *
     * @param {Object} [options]
     * @returns {jQuery}
     */
    createElement: function(options) {
        options = options || this.options;

        // Create template
        var template = $(options.templateFrom);

        if (!template.length) {
            template = this.render(options.template);
        }

        if (!template.length) {
            throw new Error('Failed to render template');
        }

        // Add a class name
        if (options.className) {
            template.addClass(options.className);
        }

        // Add animation class
        if (options.animation) {
            template.addClass(options.animation);
        }

        return template
            .attr('id', this.id())
            .conceal(true) // Add hide class
            .hide() // Set display to none
            .appendTo('body');
    },

    /**
     * {@inheritdoc}
     */
    doDestroy: function() {
        Component.prototype.doDestroy.call(this);

        this.element.remove();
    }

}, {
    template: '',
    templateFrom: ''
});

return TemplateComponent;
});
