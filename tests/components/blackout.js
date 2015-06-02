define([
    'jquery',
    '../../js/components/blackout'
], function($, Blackout) {

describe('Toolkit.Blackout', function() {
    var element,
        blackout;

    before(function() {
        blackout = Blackout.instance();
        element = blackout.element;
    });

    describe('constructor()', function() {
        var el;

        beforeEach(function() {
            el = $('#toolkit-blackout-1');
        });

        it('should auto-create the element', function() {
            expect(el[0]).to.equal(element[0]);
        });

        it('should auto-create the loader element', function() {
            expect(el.find('.loader')[0]).to.equal(blackout.loader[0]);
        });

        it('should set the loading message', function() {
            expect(el.find('.loader-message').text()).to.equal('Loading...');
        });
    });

    describe('show()', function() {
        it('should reveal the element on the first show', function(done) {
            expect(element.css('display')).to.equal('none');
            expect(blackout.count).to.equal(0);

            blackout.show();

            setTimeout(function() {
                expect(element.css('display')).to.equal('block');
                expect(blackout.count).to.equal(1);

                done();
            }, 10);
        });

        it('should increase the count on each consecutive show', function() {
            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(1);

            blackout.show();

            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(2);

            blackout.show();

            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(3);
        });
    });

    describe('hide()', function() {
        it('should decrease the count on each consecutive hide', function() {
            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(3);

            blackout.hide();

            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(2);

            blackout.hide();

            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(1);
        });

        it('should conceal the element on the last show', function(done) {
            expect(element.css('display')).to.equal('block');
            expect(blackout.count).to.equal(1);

            blackout.hide();

            setTimeout(function() {
                expect(element.css('display')).to.equal('none');
                expect(blackout.count).to.equal(0);

                done();
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            blackout.destroy();
        });

        it('should delete the element', function() {
            expect($('#toolkit-blackout-1').length).to.equal(0);
        });
    });
});

});
