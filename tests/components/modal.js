define([
    'jquery',
    '../../js/components/modal'
], function($) {

describe('Toolkit.Modal', function() {
    var element,
        modal;

    before(function() {
        element = $('<a/>')
            .addClass('js-modal')
            .attr('id', 'modal-node')
            .attr('href', '#modal-node')
            .text('Titon')
            .appendTo('body');

        modal = $('.js-modal').modal().toolkit('modal');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should create the element', function() {
            expect($('body').find('> .modal').length).to.equal(1);
        });

        it('should set ARIA attributes', function() {
            expect(modal.element.attr('role')).to.equal('dialog');
            expect(modal.element.aria('labelledby')).to.equal('toolkit-modal-1-title');
            expect(modal.element.aria('describedby')).to.equal('toolkit-modal-1-content');
        });
    });

    describe('hide()', function() {
        beforeEach(function() {
            modal.show(element, 'Foobar');
        });

        it('should hide the element', function(done) {
            setTimeout(function() {
                expect(modal.element.hasClass('show')).to.be.true;

                modal.hide();

                expect(modal.element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should hide the blackout', function(done) {
            setTimeout(function() {
                expect(modal.blackout.element.hasClass('show')).to.be.true;

                modal.hide();

                expect(modal.blackout.element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should not position if content is true', function() {
            expect(modal.element.hasClass('show')).to.be.false;

            modal.position(true);

            expect(modal.element.hasClass('show')).to.be.false;
        });

        it('should load the content from another element', function(done) {
            expect(modal.element.find('[data-modal-content]').text()).to.equal('Foobar'); // Already set

            modal.show(element);

            expect(modal.element.find('[data-modal-content]').text()).to.equal('Titon');

            setTimeout(function() {
                modal.hide();

                done();
            }, 10);
        });

        it('should set the content', function(done) {
            expect(modal.element.find('[data-modal-content]').text()).to.equal('Titon'); // Already set

            modal.position('Barbaz');

            expect(modal.element.find('[data-modal-content]').text()).to.equal('Barbaz');

            setTimeout(function() {
                modal.hide();

                done();
            }, 10);
        });

        it('should set a `min-height` if `fullScreen` is true', function(done) {
            var content = modal.element.find('[data-modal-content]');

            expect(content.css('min-height')).to.equal('0px');

            modal.options.fullScreen = true;
            modal.position('Bazfoo');

            expect(content.css('min-height')).to.equal($(window).height() + 'px');

            content.css('min-height', '');
            modal.options.fullScreen = false;

            setTimeout(function() {
                modal.hide();

                done();
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            modal.destroy();
        });

        it('should remove the element', function() {
            expect($('body').find('> .modal').length).to.equal(0);
        });
    });
});

});