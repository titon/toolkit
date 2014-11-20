define([
    'jquery',
    '../../js/components/off-canvas'
], function($) {

describe('Toolkit.OffCanvas', function() {
    var element,
        offCanvas,
        offCanvasRight;

    before(function() {
        element = $('<div class="canvas"></div>').html(
            '<main class="on-canvas" data-offcanvas-content>Main content</main>' +
            '<aside class="off-canvas off-canvas--left" id="left-sidebar" data-offcanvas-sidebar="left">Left sidebar</aside>' +
            '<aside class="off-canvas off-canvas--right" id="right-sidebar" data-offcanvas-sidebar="right">Right sidebar</aside>'
        ).appendTo('body');

        offCanvas = $('#left-sidebar').offCanvas().toolkit('offCanvas');
        offCanvasRight = $('#right-sidebar').offCanvas().toolkit('offCanvas');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should set ARIA attributes', function() {
            expect(offCanvas.element.attr('role')).to.equal('complementary');
            expect(offCanvas.primary.attr('role')).to.equal('main');
        });

        it('should find the parent container', function() {
            expect(offCanvas.container.is(element)).to.be.true;
        });

        it('should set the `animation` class on the container', function() {
            expect(offCanvas.container.hasClass('push')).to.be.true;
        });

        it('should find sibling sidebars', function() {
            expect(offCanvas.secondary.length).to.equal(1);
            expect(offCanvas.secondary.attr('id')).to.equal('right-sidebar');
        });

        it('should determine the current and opposite side', function() {
            expect(offCanvas.side).to.equal('left');
            expect(offCanvas.opposite).to.equal('right');
        });
    });

    describe('hide()', function() {
        it('should remove the container move class', function(done) {
            offCanvas.show();

            setTimeout(function() {
                expect(element.hasClass('move-right')).to.be.true;

                offCanvas.hide();

                expect(element.hasClass('move-right')).to.be.false;

                done();
            }, 10);
        });

        it('should hide the sidebar', function(done) {
            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.hasClass('show')).to.be.true;

                offCanvas.hide();

                expect(offCanvas.element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should remove the expanded sidebar class', function(done) {
            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.hasClass('is-expanded')).to.be.true;

                offCanvas.hide();

                expect(offCanvas.element.hasClass('is-expanded')).to.be.false;

                done();
            }, 10);
        });

        it('should set ARIA attributes', function(done) {
            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.aria('expanded')).to.equal('true');
                expect(offCanvas.element.aria('hidden')).to.equal('false');

                offCanvas.hide();

                expect(offCanvas.element.aria('expanded')).to.equal('false');
                expect(offCanvas.element.aria('hidden')).to.equal('true');

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should add the container move class', function(done) {
            offCanvas.hide();

            expect(element.hasClass('move-right')).to.be.false;

            offCanvas.show();

            setTimeout(function() {
                expect(element.hasClass('move-right')).to.be.true;

                done();
            }, 10);
        });

        it('should show the sidebar', function(done) {
            offCanvas.hide();

            expect(offCanvas.element.hasClass('show')).to.be.false;

            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.hasClass('show')).to.be.true;

                done();
            }, 10);
        });

        it('should add the expanded sidebar class', function(done) {
            offCanvas.hide();

            expect(offCanvas.element.hasClass('is-expanded')).to.be.false;

            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.hasClass('is-expanded')).to.be.true;

                done();
            }, 10);
        });

        it('should set ARIA attributes', function(done) {
            offCanvas.hide();

            expect(offCanvas.element.aria('expanded')).to.equal('false');
            expect(offCanvas.element.aria('hidden')).to.equal('true');

            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.aria('expanded')).to.equal('true');
                expect(offCanvas.element.aria('hidden')).to.equal('false');

                done();
            }, 10);
        });

        it('should hide sibling sidebars if `hideOthers` is true', function(done) {
            offCanvas.show();

            setTimeout(function() {
                expect(offCanvas.element.hasClass('show')).to.be.true;
                expect(offCanvasRight.element.hasClass('show')).to.be.false;

                offCanvasRight.show();

                setTimeout(function() {
                    expect(offCanvas.element.hasClass('show')).to.be.false;
                    expect(offCanvasRight.element.hasClass('show')).to.be.true;

                    done();
                }, 10);
            }, 10);
        });

        it('should not hide sibling sidebars if `hideOthers` is false', function(done) {
            offCanvas.show();
            offCanvasRight.options.hideOthers = false;

            setTimeout(function() {
                expect(offCanvas.element.hasClass('show')).to.be.true;
                expect(offCanvasRight.element.hasClass('show')).to.be.false;

                offCanvasRight.show();

                setTimeout(function() {
                    expect(offCanvas.element.hasClass('show')).to.be.true;
                    expect(offCanvasRight.element.hasClass('show')).to.be.true;

                    done();
                }, 10);
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            offCanvas.destroy();
            offCanvasRight.destroy();
        });

        it('should hide the sidebar', function() {
            expect(offCanvas.element.hasClass('show')).to.be.false;
            expect(offCanvasRight.element.hasClass('show')).to.be.false;
        });
    });
});

});