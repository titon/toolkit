/**
 * @copyright   2010-2015, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

define([
    'jquery',
    '../flags/touch'
], function($, isTouch) {

/**
 * An event that allows the clicking of the document to trigger a callback.
 * However, will only trigger if the element clicked is not in the exclude list or a child of.
 * Useful for closing drop downs and menus.
 *
 * Based on and credited to http://benalman.com/news/2010/03/jquery-special-events/
 *
 * @returns {Object}
 */
$.event.special.clickout = (function() {
    var elements = [];

    $(document).on(isTouch ? 'touchend' : 'click', function(e) {
        if (!elements.length) {
            return;
        }

        var trigger = true,
            collection = $(document),
            target = $(e.target);

        $.each(elements, function(i, item) {
            var self = $(item);

            // Test that the delegated selector class matches
            if ($.type(item) === 'string') {
                trigger = (!target.is(item) && !self.has(e.target).length);

            // Else test if the element matches
            } else {
                trigger = (!self.is(e.target) && !self.has(e.target).length);
            }

            if (trigger) {
                collection = collection.add(self);
            } else {
                return false;
            }
        });

        if (trigger) {
            collection.trigger('clickout', [e.target]);
        }
    });

    return {
        add: function(handler) {
            var context = this;

            if (this === document) {
                context = handler.selector;
            }

            if ($.inArray(context, elements) === -1) {
                elements.push(context);
            }
        },
        remove: function(handler) {
            var context = this;

            if (this === document) {
                context = handler.selector;
            }

            elements = $.grep(elements, function(item) {
                return (item !== context);
            });
        }
    };
})();

});