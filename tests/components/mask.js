define([
    'jquery',
    '../../js/components/mask'
], function($) {

describe('Toolkit.Mask', function() {
    var element, mask;

    before(function() {
        element = $('<div/>').appendTo('body').text('Foobar').mask();
        mask = element.toolkit('mask');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should automatically create a mask in the target', function() {
            expect(element.find('[data-mask]').length).to.equal(1);
        });

        it('should use a mask if it already exists', function() {
            var el = $('<div><div class="mask" data-mask="foo"></div></div>').mask();

            expect(el.find('[data-mask]').length).to.equal(1);
            expect(el.find('[data-mask]').data('mask')).to.equal('foo');

            el.remove();
        });

        it('should set the position and state class', function() {
            expect(element.hasClass('is-maskable')).to.be.true;
            expect(element.css('position')).to.equal('relative');
        });
    });

    describe('hide()', function() {
        it('should hide the mask', function(done) {
            mask.show();

            setTimeout(function() {
                expect(mask.mask.hasClass('show')).to.be.true;

                mask.hide();

                expect(mask.mask.hasClass('hide')).to.be.true;

                done();
            }, 10);
        });

        it('should remove the masked class on the target', function() {
            mask.show();

            expect(element.hasClass('is-masked')).to.be.true;

            mask.hide();

            expect(element.hasClass('is-masked')).to.be.false;
        });
    });

    describe('setMask()', function() {
        it('should automatically create the message if the copy is set', function() {
            expect(element.find('[data-mask-message]').length).to.equal(0);

            var el = $('<div><div class="mask" data-mask="foo"></div></div>').mask({
                messageContent: 'Loading...'
            });

            expect(el.find('[data-mask-message]').length).to.equal(1);
            expect(el.find('[data-mask-message]').text()).to.equal('Loading...');

            el.remove();
        });
    });

    describe('show()', function() {
        it('should show the mask', function(done) {
            mask.hide();

            expect(mask.mask.hasClass('hide')).to.be.true;

            mask.show();

            setTimeout(function() {
                expect(mask.mask.hasClass('show')).to.be.true;

                done();
            }, 10);
        });

        it('should add the masked class on the target', function() {
            mask.hide();

            expect(element.hasClass('is-masked')).to.be.false;

            mask.show();

            expect(element.hasClass('is-masked')).to.be.true;
        });
    });

    describe('toggle()', function() {
        it('should toggle between show and hide states', function(done) {
            expect(mask.mask.is(':shown')).to.be.false;

            mask.toggle();

            setTimeout(function() {
                expect(mask.mask.is(':shown')).to.be.true;

                mask.toggle();

                setTimeout(function() {
                    expect(mask.mask.is(':shown')).to.be.false;

                    done();
                }, 10);
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            mask.show();
            mask.destroy();
        });

        it('should remove the mask element', function() {
            expect(element.find('[data-mask]').length).to.equal(0);
        });

        it('should remove the mask classes from the target', function() {
            expect(element.hasClass('is-masked')).to.be.false;
            expect(element.hasClass('is-maskable')).to.be.false;
        });

        it('should remove the relative position', function() {
            expect(element.css('position')).to.equal('static');
        });
    });
});

});