define([
    './aria'
], function() {

/**
 * Reveal the element by applying the show class.
 * Should be used to trigger transitions and animations.
 *
 * @returns {jQuery}
 */
$.fn.reveal = function() {
    return this
        .removeClass('hide')
        .addClass('show')
        .aria('hidden', false);
};

});