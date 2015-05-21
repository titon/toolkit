define([
    'jquery',
    '../js/toolkit'
], function($, Toolkit) {

describe('Toolkit', function() {
    it('should be available on the window object', function() {
        expect(window).to.have.property('Toolkit');
    });

    describe('bem()', function() {
        it('should generate a class name', function() {
            expect(Toolkit.bem('foo')).to.equal('foo');
            expect(Toolkit.bem('foo', 'bar')).to.equal('foo-bar');
            expect(Toolkit.bem('foo', 'bar', 'baz')).to.equal('foo-bar--baz');
            expect(Toolkit.bem('foo', '', 'baz')).to.equal('foo--baz');
        });

        it('should be able to customize separators', function() {
            Toolkit.bemSeparators = ['__', '---'];

            expect(Toolkit.bem('foo')).to.equal('foo');
            expect(Toolkit.bem('foo', 'bar')).to.equal('foo__bar');
            expect(Toolkit.bem('foo', 'bar', 'baz')).to.equal('foo__bar---baz');
            expect(Toolkit.bem('foo', '', 'baz')).to.equal('foo---baz');

            Toolkit.bemSeparators = ['-', '--'];
        });

        it('should prepend the `namespace`', function() {
            Toolkit.namespace = 'tk-';

            expect(Toolkit.bem('foo', 'bar')).to.equal('tk-foo-bar');

            Toolkit.namespace = '';
        });
    });

    describe('createPlugin()', function() {
        function Stub(value) {
            this.value = value;
        }

        before(function() {
            Toolkit.createPlugin('single', function() { return new Stub('single'); });
            Toolkit.createPlugin('multiple', function() { return new Stub('multiple'); }, true);
        });

        it('should extend the jQuery prototype', function() {
            expect($.fn).to.have.property('single');
        });

        it('should create a single instance for each element when not a collection', function() {
            var elements = $('<span></span><span></span>').single();

            expect(elements.eq(0).data('toolkit.single')).to.not.equal(elements.eq(1).data('toolkit.single'));

            elements.remove();
        });

        it('should create a single instance for all elements when a collection', function() {
            var elements = $('<span></span><span></span>').multiple();

            expect(elements.eq(0).data('toolkit.multiple')).to.equal(elements.eq(1).data('toolkit.multiple'));

            elements.remove();
        });

        it('should exist in the cache when a collection', function() {
            expect(Toolkit.cache).to.have.property('multiple:'); // Test above did not have a selector
        });

        it('should rename method when a collision occurs', function() {
            Toolkit.createPlugin('single', function() {});

            expect($.fn).to.have.property('single');
            expect($.fn).to.have.property('toolkitSingle');
            expect($.fn.single).to.not.equal($.fn.toolkitSingle);
        });

        after(function() {
            delete $.fn.single;
            delete $.fn.multiple;
            delete $.fn.toolkitSingle;

            Toolkit.cache = {};
        });
    });

    describe('buildTemplate()', function() {
        it('should return a string', function() {
            expect(Toolkit.buildTemplate('foo')).to.equal('foo');
            expect(Toolkit.buildTemplate(123)).to.equal('123');
        });

        it('should execute a function if passed', function() {
            expect(Toolkit.buildTemplate(function() {
                return 'foo';
            })).to.equal('foo');
        });

        it('should pass `bem()` to the function', function() {
            expect(Toolkit.buildTemplate(function(bem) {
                return bem('b', 'e', 'm');
            })).to.equal('b-e--m');
        });

        it('should pass `namespace` to the function', function() {
            Toolkit.namespace = 'tk-';

            expect(Toolkit.buildTemplate(function(bem, namespace) {
                return namespace + 'foo';
            })).to.equal('tk-foo');

            Toolkit.namespace = '';
        });
    });
});

});
