define([
    'jquery',
    '../../js/components/drop'
], function($) {

describe('Toolkit.Drop', function() {
    var element,
        menu,
        drop;

    before(function() {
        element = $('<button/>').addClass('js-drop').text('Foobar').attr('data-drop', '#drop').appendTo('body');

        menu = $('<ul class="drop drop--down" data-drop-menu></ul>').attr('id', 'drop').html('<li>Item</li>').appendTo('body');

        drop = $('.js-drop').drop().toolkit('drop');
    });

    after(function() {
        element.remove();
        menu.remove();
    });

    describe('hide()', function() {
        it('should hide the menu', function(done) {
            drop.show(element);

            setTimeout(function() {
                expect(menu.hasClass('show')).to.be.true;

                drop.hide();

                expect(menu.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should remove the active state on the node', function(done) {
            drop.show(element);

            setTimeout(function() {
                expect(element.hasClass('is-active')).to.be.true;
                expect(element.aria('expanded')).to.equal('true');

                drop.hide();

                expect(element.hasClass('is-active')).to.be.false;
                expect(element.aria('expanded')).to.equal('false');

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should show the menu', function(done) {
            expect(menu.hasClass('show')).to.be.false;

            drop.show(element);

            setTimeout(function() {
                expect(menu.hasClass('show')).to.be.true;

                drop.hide();

                done();
            }, 10);
        });

        it('should set the active state on the node', function(done) {
            expect(element.hasClass('is-active')).to.be.false;
            expect(element.aria('expanded')).to.equal('false');

            drop.show(element);

            setTimeout(function() {
                expect(element.hasClass('is-active')).to.be.true;
                expect(element.aria('expanded')).to.equal('true');

                drop.hide();

                done();
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            drop.show(element);
            drop.destroy();
        });

        it('should hide opened menus', function(done) {
            setTimeout(function() {
                expect(menu.hasClass('show')).to.be.true;

                done();
            }, 10);
        });
    });
});

});