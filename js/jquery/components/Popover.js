/**
 * @copyright   2010-2013, The Titon Project
 * @license     http://opensource.org/licenses/bsd-license.php
 * @link        http://titon.io
 */

Toolkit.Popover = Toolkit.Tooltip.extend(function(nodes, options) {
    var element;

    // Force to click for popovers
    options.mode = 'click';

    this.component = 'Popover';
    this.version = '1.3.0';
    this.options = options = this.setOptions(options);
    this.element = element = this.createElement()
        .attr('role', 'tooltip')
        .removeClass(options.className);

    // Remove title attributes
    if (options.getTitle === 'title') {
        options.getTitle = 'data-popover-title';
    }

    // Elements for the title and content
    this.elementHead = element.find('.' + vendor + 'popover-head');
    this.elementBody = element.find('.' + vendor + 'popover-body');

    // Nodes found in the page on initialization, remove title attribute
    this.nodes = $(nodes).each(function(i, node) {
        $(node).attr('data-popover-title', $(node).attr('title')).removeAttr('title');
    });

    // Last node to open a tooltip
    this.node = null;

    // Initialize events
    this.events = {
        'clickout element': 'hide',
        'clickout document {selector}': 'hide',
        'click document {selector}': 'onShow'
    };

    this.initialize();
}, {
}, {
    getContent: 'data-popover',
    template: '<div class="popover">' +
        '<div class="popover-inner">' +
            '<div class="popover-head"></div>' +
            '<div class="popover-body"></div>' +
        '</div>' +
        '<div class="popover-arrow"></div>' +
    '</div>'
});

Toolkit.create('popover', function(options) {
    return new Toolkit.Popover(this, options);
}, true);