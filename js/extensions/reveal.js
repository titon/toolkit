define([
    'jquery',
    './aria'
], function($) {

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @param {bool} dontShow
 * @returns {jQuery}
 */
$.fn.reveal = function(dontShow) {
    if (!dontShow) {
        this.show();
    }

    // We must place in a timeout or transitions do not occur
    setTimeout(function() {
        this.removeClass('hide')
            .addClass('show')
            .aria('hidden', false);
    }.bind(this), 1);

    return this;
};

});