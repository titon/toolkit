define([
    'jquery',
    '../js/events/clickout',
    '../js/events/swipe'
], function($) {

describe('Events', function() {
    describe('clickout', function() {
        it('should be defined as a jQuery event', function() {
            expect($.event.special).to.have.property('clickout');
        });
    });

    describe('swipe', function() {
        it('should be defined as a jQuery event', function() {
            expect($.event.special).to.have.property('swipe');
            expect($.event.special).to.have.property('swipeleft');
            expect($.event.special).to.have.property('swiperight');
            expect($.event.special).to.have.property('swipeup');
            expect($.event.special).to.have.property('swipedown');
        });

        it('should be configurable', function() {
            expect($.event.special.swipe.distance).to.equal(50);

            $.event.special.swipe.distance = 100;

            expect($.event.special.swipe.distance).to.equal(100);
        });
    });
});

});