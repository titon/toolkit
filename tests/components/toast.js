define([
    'jquery',
    '../../js/components/toast'
], function($) {

describe('Toolkit.Toast', function() {
    var element,
        toast;

    before(function() {
        toast = $('body').toast({
            duration: 1000
        }).toolkit('toast');

        toast.addHook('create', function(toast) {
            element = toast;
        });
    });

    describe('constructor()', function() {
        it('should create the toasts wrapper', function() {
            expect($('body').find('> .toasts').length).to.equal(1);
        });

        it('should set the position as a class name', function() {
            expect(toast.wrapper.hasClass('bottom-left')).to.be.true;
        });

        it('should set ARIA attributes', function() {
            expect(toast.wrapper.attr('role')).to.equal('log');
            expect(toast.wrapper.aria('relevant')).to.equal('additions');
        });
    });

    describe('create()', function() {
        it('should create a toast within the container', function() {
            toast.create('Foo');

            expect(element.hasClass('toast')).to.be.true;
            expect(element.text()).to.equal('Foo');
            expect($.contains(toast.wrapper[0], element[0])).to.be.true;
        });

        it('should set the animation class name', function() {
            toast.create('Bar');

            expect(element.hasClass('slide-up')).to.be.true;
        });

        it('should set ARIA attributes', function() {
            toast.create('Baz');

            expect(element.attr('role')).to.equal('note');
        });

        it('should allow custom options to be set', function() {
            toast.create('Foo', {
                animation: 'slide-left',
                template: '<section class="toast"></section>'
            });

            expect(element.prop('tagName').toLowerCase()).to.equal('section');
            expect(element.hasClass('slide-left')).to.be.true;
        });

        it('should allow HTML to be set', function() {
            toast.create('<b>Bar</b>');

            expect(element.html()).to.equal('<b>Bar</b>');
        });

        it('should allow DOM nodes to be set', function() {
            toast.create($('<i/>').html('Baz'));

            expect(element.html()).to.equal('<i>Baz</i>');
        });
    });

    describe('hide()', function() {
        it('should remove the toast after the duration', function(done) {
            toast.create('Foo');

            expect($.contains(toast.wrapper[0], element[0])).to.be.true;

            setTimeout(function() {
                expect($.contains(toast.wrapper[0], element[0])).to.be.false;

                done();
            }, 1100);
        });
    });

    describe('show()', function() {
        it('should show the toast after a small delay', function(done) {
            toast.create('Foo');

            expect(element.hasClass('hide')).to.be.true;

            setTimeout(function() {
                expect(element.hasClass('hide')).to.be.false;

                done();
            }, 100);
        });
    });

    describe('destroy()', function() {
        before(function() {
            toast.destroy();
        });

        it('should remove the toasts container', function() {
            expect($('body').find('> .toasts').length).to.equal(0);
        });
    });
});

});