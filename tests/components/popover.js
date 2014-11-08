define([
    'jquery',
    '../../js/components/popover'
], function($) {

describe('Toolkit.Popover', function() {
    var element,
        popover;

    before(function() {
        element = $('<a/>')
            .addClass('js-popover')
            .attr('title', 'Title')
            .attr('data-popover', 'Content')
            .attr('data-popover-classname', 'foobar')
            .text('Foobar')
            .appendTo('body');

        popover = $('.js-popover').popover().toolkit('popover');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should create the popover markup', function() {
            expect($('body').find('> .popover').length).to.equal(1);

            expect(popover.element.attr('id')).to.equal('toolkit-popover-1');
        });

        it('should set ARIA attributes', function() {
            expect(popover.element.attr('role')).to.equal('tooltip');
        });

        it('should convert the title attribute on nodes', function() {
            expect(element.attr('title')).to.be.undefined;
            expect(element.data('popover-title')).to.equal('Title');
        });
    });

    describe('hide()', function() {
        it('should hide the popover', function(done) {
            popover.show(element);

            setTimeout(function() {
                expect(popover.element.hasClass('show')).to.be.true;

                popover.hide();

                expect(popover.element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should reset runtime options', function(done) {
            popover.show(element);

            setTimeout(function() {
                expect(popover.element.hasClass('foobar')).to.be.true;

                popover.hide();

                expect(popover.element.hasClass('foobar')).to.be.false;

                done();
            }, 10);
        });

        it('should remove ARIA attributes from the node', function(done) {
            popover.show(element);

            setTimeout(function() {
                expect(element.attr('aria-describedby')).to.equal('toolkit-popover-1');

                popover.hide();

                expect(element.attr('aria-describedby')).to.be.undefined;

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should show the popover', function(done) {
            popover.show(element);

            setTimeout(function() {
                expect(popover.element.hasClass('show')).to.be.true;

                done();
            }, 15);
        });

        it('should inherit the title and content from attributes', function(done) {
            popover.show(element);

            setTimeout(function() {
                expect(popover.elementHead.html()).to.equal('Title');
                expect(popover.elementBody.html()).to.equal('Content');

                done();
            }, 10);
        });

        it('should allow a custom title and content', function(done) {
            popover.show(element, 'Foo', 'Bar');

            setTimeout(function() {
                expect(popover.elementHead.html()).to.equal('Bar');
                expect(popover.elementBody.html()).to.equal('Foo');

                done();
            }, 10);
        });

        it('should set the `position` and `className` runtime classes', function(done) {
            popover.show(element);

            setTimeout(function() {
                expect(popover.element.hasClass('top-center')).to.be.true;
                expect(popover.element.hasClass('foobar')).to.be.true;

                done();
            }, 10);
        });

        it('should set ARIA attributes on the node', function() {
            popover.show(element);

            expect(element.attr('aria-describedby')).to.equal('toolkit-popover-1');
        });
    });

    describe('destroy()', function() {
        before(function() {
            popover.destroy();
        });

        it('should remove the element', function() {
            expect($('body').find('> .popover').length).to.equal(0);
        });
    });

});

});