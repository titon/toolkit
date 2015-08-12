define([
    'jquery',
    '../../js/components/tooltip'
], function($) {

describe('Toolkit.Tooltip', function() {
    var node,
        element,
        tooltip;

    before(function() {
        node = $('<a/>')
            .addClass('js-tooltip')
            .attr('title', 'Title')
            .attr('data-tooltip', 'Content')
            .attr('data-tooltip-classname', 'foobar')
            .text('Foobar')
            .appendTo('body');

        tooltip = $('.js-tooltip').tooltip().toolkit('tooltip');

        tooltip.addHook('shown', function() {
            element = this.elements[this.node.cache('toolkit.cid')];
        });
    });

    after(function() {
        node.remove();
    });

    describe('constructor()', function() {
        it('should create the tooltip wrapper', function() {
            expect($('body').find('> .tooltips').length).to.equal(1);

            expect(tooltip.wrapper.attr('id')).to.equal('toolkit-tooltip-1-wrapper');
        });

        it('should convert the title attribute on nodes', function() {
            expect(node.attr('title')).to.be.undefined;
            expect(node.data('tooltip-title')).to.equal('Title');
        });

        it('should create the tooltip on demand', function() {
            expect(Object.keys(tooltip.elements)).to.have.length(0);

            tooltip.show(node);

            expect(Object.keys(tooltip.elements)).to.have.length(1);
        });
    });

    describe('hide()', function() {
        it('should hide the tooltip', function(done) {
            tooltip.show(node);

            setTimeout(function() {
                expect(element.hasClass('show')).to.be.true;

                tooltip.hide();

                expect(element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should remove ARIA attributes from the node', function(done) {
            tooltip.show(node);

            setTimeout(function() {
                expect(node.attr('aria-describedby')).to.equal('toolkit-tooltip-1');

                tooltip.hide();

                expect(node.attr('aria-describedby')).to.be.undefined;

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should show the tooltip', function(done) {
            tooltip.show(node);

            setTimeout(function() {
                expect(element.hasClass('show')).to.be.true;

                done();
            }, 15);
        });

        it('should set ARIA attributes', function() {
            tooltip.show(node);

            expect(element.attr('role')).to.equal('tooltip');
        });

        it('should inherit the title and content from attributes', function(done) {
            tooltip.show(node);

            setTimeout(function() {
                expect(element.find('[data-tooltip-header]').html()).to.equal('Title');
                expect(element.find('[data-tooltip-content]').html()).to.equal('Content');

                done();
            }, 10);
        });

        it('should allow custom content', function(done) {
            tooltip.show(node, 'Foo');

            setTimeout(function() {
                expect(element.find('[data-tooltip-content]').html()).to.equal('Foo');

                done();
            }, 10);
        });

        it('should allow custom content element', function(done) {
            var content = document.createElement('div');
                content.innerHTML = 'Foo';

            tooltip.show(node, content);

            setTimeout(function() {
                expect(element.find('[data-tooltip-content]')[0].children[0]).to.equal(content);

                done();
            }, 10);
        });

        it('should set the `position` and `className` runtime classes', function(done) {
            tooltip.show(node);

            setTimeout(function() {
                expect(element.hasClass('top-center')).to.be.true;
                expect(element.hasClass('foobar')).to.be.true;

                done();
            }, 10);
        });

        it('should set ARIA attributes on the node', function() {
            tooltip.show(node);

            expect(node.attr('aria-describedby')).to.equal('toolkit-tooltip-1');
        });
    });

    describe('destroy()', function() {
        before(function() {
            tooltip.destroy();
        });

        it('should remove the wrapper', function() {
            expect($('body').find('> .tooltips').length).to.equal(0);
        });
    });

});

});
