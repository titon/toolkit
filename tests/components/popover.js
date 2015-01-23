define([
    'jquery',
    '../../js/components/popover'
], function($) {

describe('Toolkit.Popover', function() {
    var node,
        element,
        popover;

    before(function() {
        node = $('<a/>')
            .addClass('js-popover')
            .attr('title', 'Title')
            .attr('data-popover', 'Content')
            .attr('data-popover-classname', 'foobar')
            .text('Foobar')
            .appendTo('body');

        popover = $('.js-popover').popover().toolkit('popover');

        popover.addHook('shown', function() {
            element = this.elements[this.node.cache('toolkit.cid')];
        });
    });

    after(function() {
        node.remove();
    });

    describe('constructor()', function() {
        it('should create the popover wrapper', function() {
            expect($('body').find('> .popovers').length).to.equal(1);

            expect(popover.wrapper.attr('id')).to.equal('toolkit-popover-1-wrapper');
        });

        it('should convert the title attribute on nodes', function() {
            expect(node.attr('title')).to.be.undefined;
            expect(node.data('popover-title')).to.equal('Title');
        });

        it('should create the popover on demand', function() {
            expect(Object.keys(popover.elements)).to.have.length(0);

            popover.show(node);

            expect(Object.keys(popover.elements)).to.have.length(1);
        });
    });

    describe('hide()', function() {
        it('should hide the popover', function(done) {
            popover.show(node);

            setTimeout(function() {
                expect(element.hasClass('show')).to.be.true;

                popover.hide();

                expect(element.hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should remove ARIA attributes from the node', function(done) {
            popover.show(node);

            setTimeout(function() {
                expect(node.attr('aria-describedby')).to.equal('toolkit-popover-1');

                popover.hide();

                expect(node.attr('aria-describedby')).to.be.undefined;

                done();
            }, 10);
        });
    });

    describe('show()', function() {
        it('should show the popover', function(done) {
            popover.show(node);

            setTimeout(function() {
                expect(element.hasClass('show')).to.be.true;

                done();
            }, 15);
        });

        it('should set ARIA attributes', function() {
            popover.show(node);

            expect(element.attr('role')).to.equal('tooltip');
        });

        it('should inherit the title and content from attributes', function(done) {
            popover.show(node);

            setTimeout(function() {
                expect(element.find('[data-popover-header]').html()).to.equal('Title');
                expect(element.find('[data-popover-content]').html()).to.equal('Content');

                done();
            }, 10);
        });

        it('should allow custom content', function(done) {
            popover.show(node, 'Foo');

            setTimeout(function() {
                expect(element.find('[data-popover-content]').html()).to.equal('Foo');

                done();
            }, 10);
        });

        it('should set the `position` and `className` runtime classes', function(done) {
            popover.show(node);

            setTimeout(function() {
                expect(element.hasClass('top-center')).to.be.true;
                expect(element.hasClass('foobar')).to.be.true;

                done();
            }, 10);
        });

        it('should set ARIA attributes on the node', function() {
            popover.show(node);

            expect(node.attr('aria-describedby')).to.equal('toolkit-popover-1');
        });
    });

    describe('destroy()', function() {
        before(function() {
            popover.destroy();
        });

        it('should remove the wrapper', function() {
            expect($('body').find('> .popovers').length).to.equal(0);
        });
    });

});

});