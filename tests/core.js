define([
    'jquery',
    '../js/core'
], function($, Toolkit) {

describe('Toolkit', function() {
    it('should be available on the window object', function() {
        expect(window.Toolkit).to.not.be.undefined;
    });

    describe('create()', function() {
        function Stub(value) {
            this.value = value;
        }

        before(function() {
            Toolkit.create('single', function() { return new Stub('single'); });
            Toolkit.create('multiple', function() { return new Stub('multiple'); }, true);
        });

        it('should extend the jQuery prototype', function() {
            expect($.fn.single).to.not.be.undefined;
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
            Toolkit.create('single', function() {});

            expect($.fn.single).to.not.be.undefined;
            expect($.fn.toolkitSingle).to.not.be.undefined;
            expect($.fn.single).to.not.equal($.fn.toolkitSingle);
        });

        after(function() {
            delete $.fn.single;
            delete $.fn.multiple;
            delete $.fn.toolkitSingle;

            Toolkit.cache = {};
        });
    });
});

});