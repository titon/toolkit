define([
    'jquery',
    '../../js/components/tooltip'
], function($) {

describe('Toolkit.Tooltip', function() {
    var element,
        tooltip;

    before(function() {
        element = $('<a/>')
            .addClass('js-tooltip')
            .attr('title', 'Title')
            .attr('data-tooltip', 'Content')
            .attr('data-tooltip-classname', 'foobar')
            .text('Foobar')
            .appendTo('body');

        tooltip = $('.js-tooltip').tooltip().toolkit('tooltip');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should create the tooltip markup', function() {
            expect($('body').find('> .tooltip').length).to.equal(1);

            expect(tooltip.element.attr('id')).to.equal('toolkit-tooltip-1');
        });

        it('should set ARIA attributes', function() {
            expect(tooltip.element.attr('role')).to.equal('tooltip');
        });

        it('should convert the title attribute on nodes', function() {
            expect(element.attr('title')).to.be.undefined;
            expect(element.data('tooltip-title')).to.equal('Title');
        });
    });

    describe('hide()', function() {
        it('should hide the tooltip', function(done) {
            tooltip.show(element);

            setTimeout(function() {
                expect(tooltip.element.hasClass('show')).to.be.true;

                tooltip.hide();

                expect(tooltip.element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should reset runtime options', function(done) {
            tooltip.show(element);

            setTimeout(function() {
                expect(tooltip.element.hasClass('foobar')).to.be.true;

                tooltip.hide();

                expect(tooltip.element.hasClass('foobar')).to.be.false;

                done();
            }, 10);
        });

        it('should remove ARIA attributes from the node', function(done) {
            tooltip.show(element);

            setTimeout(function() {
                expect(element.attr('aria-describedby')).to.equal('toolkit-tooltip-1');

                tooltip.hide();

                expect(element.attr('aria-describedby')).to.be.undefined;

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should show the tooltip', function(done) {
            tooltip.show(element);

            setTimeout(function() {
                expect(tooltip.element.hasClass('show')).to.be.true;

                done();
            }, 15);
        });

        it('should inherit the title and content from attributes', function(done) {
            tooltip.show(element);

            setTimeout(function() {
                expect(tooltip.elementHead.html()).to.equal('Title');
                expect(tooltip.elementBody.html()).to.equal('Content');

                done();
            }, 10);
        });

        it('should allow custom content', function(done) {
            tooltip.show(element, 'Foo');

            setTimeout(function() {
                expect(tooltip.elementBody.html()).to.equal('Foo');

                done();
            }, 10);
        });

        it('should set the `position` and `className` runtime classes', function(done) {
            tooltip.show(element);

            setTimeout(function() {
                expect(tooltip.element.hasClass('top-center')).to.be.true;
                expect(tooltip.element.hasClass('foobar')).to.be.true;

                done();
            }, 10);
        });

        it('should set ARIA attributes on the node', function() {
            tooltip.show(element);

            expect(element.attr('aria-describedby')).to.equal('toolkit-tooltip-1');
        });
    });

    describe('destroy()', function() {
        before(function() {
            tooltip.destroy();
        });

        it('should remove the element', function() {
            expect($('body').find('> .tooltip').length).to.equal(0);
        });
    });

});

});