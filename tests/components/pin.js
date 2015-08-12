define([
    'jquery',
    '../../js/components/pin'
], function($) {

describe('Toolkit.Pin', function() {
    var element,
        pin;

    before(function() {
        element = $('<aside class="pin" style="top: 15px"></aside>').html('Foobar').appendTo('body').pin({ animation: 'sticky' });
        pin = element.toolkit('pin');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should set ARIA attributes', function() {
            expect(element.attr('role')).to.equal('complementary');
        });

        it('should set the `animation` class', function() {
            expect(element.hasClass('sticky')).to.be.true;
        });

        it('should extract the initial top value', function() {
            expect(pin.initialTop).to.equal(15);
        });
    });

    describe('destroy()', function() {
        before(function() {
            element.addClass('is-pinned');
            pin.destroy();
        });

        it('should remove the pinned classes', function(done) {
            setTimeout(function() {
                expect(element.hasClass('is-pinned')).to.be.false;

                done();
            }, 25);
        });
    });
});

});
