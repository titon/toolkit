define([
    'jquery',
    '../js/base'
], function($, BaseClass) {

describe('Toolkit.Base', function() {
    var base, undef;

    beforeEach(function() {
        base = new BaseClass();
    });

    describe('addEvent()', function() {
        it('should append to the list', function() {
            expect(base.__events).to.deep.equal([]);

            base.addEvent('click', 'element', base.initialize);

            expect(base.__events).to.deep.equal([
                ['click', 'element', base.initialize, undef]
            ]);
        });

        it('should replace tokens', function() {
            base.options.mode = 'click';

            base.addEvent('{mode}', 'element', base.initialize, '{selector}');

            expect(base.__events[0]).to.deep.equal(['click', 'element', base.initialize, '']);
        });

        it('should convert string callbacks to a function', function() {
            base.addEvent('click', 'element', 'initialize');

            expect(base.__events[0][2]).to.be.a.function;
        });
    });

    describe('addEvents()', function() {
        it('should add multiple events', function() {
            expect(base.__events.length).to.equal(0);

            base.addEvents([
                ['click', 'element'],
                ['mouseenter', 'window'],
                ['ready', 'document']
            ]);

            expect(base.__events.length).to.equal(3);
        });
    });

    describe('addHook()', function() {
        var fn1 = function() {},
            fn2 = function() {};

        it('should create a map if it doesn\'t exist', function() {
            expect(base.__hooks).to.not.have.property('foo');

            base.addHook('foo', fn1);

            expect(base.__hooks.foo).to.deep.equal([fn1]);
        });

        it('should append to an existing map', function() {
            base.addHook('foo', fn1);

            expect(base.__hooks.foo).to.deep.equal([fn1]);

            base.addHook('foo', fn2);

            expect(base.__hooks.foo).to.deep.equal([fn1, fn2]);
        });
    });

    describe('addHooks()', function() {
        it('should add multiple hooks', function() {
            expect(base.__hooks).to.not.have.property('foo');

            base.addHooks('foo', [function() {}, function() {}]);

            expect(base.__hooks.foo.length).to.equal(2);
        });
    });

    describe('destroy()', function() {
        var Base = BaseClass.extend({
            enabled: true,
            destructor: function() {
                this.destroyed = true;
            }
        });

        it('should trigger disable()', function() {
            var temp = new Base();

            expect(temp.enabled).to.be.true;

            temp.destroy();

            expect(temp.enabled).to.be.false;
        });

        it('should trigger destructor()', function() {
            var temp = new Base();

            expect(temp.destroyed).to.be.undefined;

            temp.destroy();

            expect(temp.destroyed).to.be.true;
        });
    });

    describe('disable()', function() {
        it('should disable the plugin', function() {
            base.enabled = true;

            expect(base.enabled).to.be.true;

            base.disable();

            expect(base.enabled).to.be.false;
        });
    });

    describe('enable()', function() {
        it('should enable the plugin', function() {
            base.enabled = false;

            expect(base.enabled).to.be.false;

            base.enable();

            expect(base.enabled).to.be.true;
        });
    });

    describe('fireEvent()', function() {
        var expected = [];

        beforeEach(function() {
            base.addHook('foo', function (multiplier) {
                expected.push(1 * (multiplier || 1));
            });

            base.addHook('foo', function (multiplier) {
                expected.push(2 * (multiplier || 1));
            });
        });

        it('should trigger all hooks by type', function() {
            expected = [];
            base.fireEvent('foo');

            expect(expected).to.deep.equal([1, 2]);
        });

        it('should pass arguments to each hook', function() {
            expected = [];
            base.fireEvent('foo', [3]);

            expect(expected).to.deep.equal([3, 6]);
        });
    });

    describe('removeHook()', function() {
        var fn1 = function() {},
            fn2 = function() {};

        beforeEach(function() {
            base.addHook('foo', fn1);
            base.addHook('foo', fn2);
            base.addHook('bar', fn1);
            base.addHook('bar', fn2);
        });

        it('should remove a hook by function reference', function() {
            expect(base.__hooks.foo).to.deep.equal([fn1, fn2]);

            base.removeHook('foo', fn1);

            expect(base.__hooks.foo).to.deep.equal([fn2]);
        });

        it('should remove all hooks if no function passed', function() {
            expect(base.__hooks.bar).to.deep.equal([fn1, fn2]);

            base.removeHook('bar');

            expect(base.__hooks.bar).to.be.undefined;
        });
    });

    describe('setOptions()', function() {
        it('should merge with the parent classes static options', function() {
            var opts = base.setOptions({ foo: 'bar' });

            expect(opts).to.deep.equal({ foo: 'bar', cache: true, debug: false });
        });

        it('should override the parent options', function() {
            var opts = base.setOptions({ debug: true });

            expect(opts).to.deep.equal({ cache: true, debug: true });
        });

        it('should auto-wire hooks if the option starts with `on`', function() {
            expect(base.__hooks.foo).to.be.undefined;

            var fn = function() {},
                opts = base.setOptions({ foo: 'bar', onFoo: fn });

            expect(opts).to.deep.equal({ foo: 'bar', cache: true, debug: false });
            expect(base.__hooks.foo).to.be.deep.equal([fn]);
        });
    });
});

});
