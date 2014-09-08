define([
    'jquery',
    '../js/base'
], function($, Toolkit) {

describe('Toolkit.Base', function() {
    describe('addHook()', function() {
        var a = new Toolkit.Base(),
            fn1 = function() {},
            fn2 = function() {};

        it('should create a map if it doesn\'t exist', function() {
            expect(a.__hooks.foo).to.be.undefined;

            a.addHook('foo', fn1);

            expect(a.__hooks.foo).to.deep.equal([fn1]);
        });

        it('should append to an existing map', function() {
            expect(a.__hooks.foo).to.deep.equal([fn1]);

            a.addHook('foo', fn2);

            expect(a.__hooks.foo).to.deep.equal([fn1, fn2]);
        });
    });

    describe('bindEvents()', function() {
        it('should bind and unbind events in the mapping', function() {
            var element = $('<a/>'),
                count = 0,
                a = new Toolkit.Base();

            a.element = element;
            a.events = { 'click element': function() { count++; } };

            element.click();

            expect(count).to.equal(0);

            a.bindEvents('on');
            element.click();

            expect(count).to.equal(1);

            element.click();
            element.click();

            expect(count).to.equal(3);

            a.bindEvents('off');
            element.click();
            element.click();

            expect(count).to.equal(3);
        });
    });

    describe('destroy()', function() {
        var Base = Toolkit.Base.extend({
            enabled: true,
            destructor: function() {
                this.destroyed = true;
            }
        });

        it('should trigger disable()', function() {
            var a = new Base();

            expect(a.enabled).to.be.true;

            a.destroy();

            expect(a.enabled).to.be.false;
        });

        it('should trigger destructor()', function() {
            var a = new Base();

            expect(a.destroyed).to.be.undefined;

            a.destroy();

            expect(a.destroyed).to.be.true;
        });
    });

    describe('disable()', function() {
        it('should disable the plugin', function() {
            var a = new Toolkit.Base();
                a.enabled = true;

            expect(a.enabled).to.be.true;

            a.disable();

            expect(a.enabled).to.be.false;
        });
    });

    describe('enable()', function() {
        it('should enable the plugin', function() {
            var a = new Toolkit.Base();
                a.enabled = false;

            expect(a.enabled).to.be.false;

            a.enable();

            expect(a.enabled).to.be.true;
        });
    });

    describe('fireEvent()', function() {
        var expected = [],
            a = new Toolkit.Base();

        a.addHook('foo', function(multiplier) {
            expected.push(1 * (multiplier || 1));
        });

        a.addHook('foo', function(multiplier) {
            expected.push(2 * (multiplier || 1));
        });

        it('should trigger all hooks by type', function() {
            expected = [];
            a.fireEvent('foo');

            expect(expected).to.deep.equal([1, 2]);
        });

        it('should pass arguments to each hook', function() {
            expected = [];
            a.fireEvent('foo', [3]);

            expect(expected).to.deep.equal([3, 6]);
        });
    });

    describe('removeHook()', function() {
        var a = new Toolkit.Base(),
            fn1 = function() {},
            fn2 = function() {};

        a.addHook('foo', fn1);
        a.addHook('foo', fn2);
        a.addHook('bar', fn1);
        a.addHook('bar', fn2);

        it('should remove a hook by function reference', function() {
            expect(a.__hooks.foo).to.deep.equal([fn1, fn2]);

            a.removeHook('foo', fn1);

            expect(a.__hooks.foo).to.deep.equal([fn2]);
        });

        it('should remove all hooks if no function passed', function() {
            expect(a.__hooks.bar).to.deep.equal([fn1, fn2]);

            a.removeHook('bar');

            expect(a.__hooks.bar).to.be.undefined;
        });
    });

    describe('setOptions()', function() {
        var a = new Toolkit.Base();

        it('should merge with the parent classes static options', function() {
            var opts = a.setOptions({ foo: 'bar' });

            expect(opts).to.deep.equal({ foo: 'bar', cache: true, debug: false });
        });

        it('should override the parent options', function() {
            var opts = a.setOptions({ debug: true });

            expect(opts).to.deep.equal({ cache: true, debug: true });
        });

        it('should auto-wire hooks if the option starts with `on`', function() {
            expect(a.__hooks.foo).to.be.undefined;

            var fn = function() {},
                opts = a.setOptions({ foo: 'bar', onFoo: fn });

            expect(opts).to.deep.equal({ foo: 'bar', cache: true, debug: false });
            expect(a.__hooks.foo).to.be.deep.equal([fn]);
        });
    });
});

});