define([
    'jquery',
    '../js/extensions/aria',
    '../js/extensions/bound',
    '../js/extensions/cache',
    '../js/extensions/conceal',
    '../js/extensions/debounce',
    '../js/extensions/position-to',
    '../js/extensions/reveal',
    '../js/extensions/shown-selector',
    '../js/extensions/throttle',
    '../js/extensions/to-string',
    '../js/extensions/toolkit',
    '../js/extensions/transitionend'
], function($) {

describe('Extensions', function () {
    describe('aria()', function() {
        it('should set aria-* attributes', function() {
            expect($('<span/>').aria('live', 'off').toString()).to.equal('<span aria-live="off"></span>');
        });

        it('should autobox true and false booleans', function() {
            expect($('<span/>').aria('expanded', true).toString()).to.equal('<span aria-expanded="true"></span>');
            expect($('<span/>').aria('expanded', false).toString()).to.equal('<span aria-expanded="false"></span>');
        });

        it('should set the custom `toggled` property', function() {
            expect($('<span/>').aria('toggled', true).toString()).to.equal('<span aria-expanded="true" aria-selected="true"></span>');
        });

        it('should not be set if `Toolkit.aria` is false', function() {
            Toolkit.aria = false;
            expect($('<span/>').aria('live', 'off').toString()).to.equal('<span></span>');

            Toolkit.aria = true;
            expect($('<span/>').aria('live', 'off').toString()).to.equal('<span aria-live="off"></span>');
        });
    });

    describe('bound()', function() {
        it('should return the same number if between bounds', function() {
            expect($.bound(10, 15, 5)).to.equal(10);
        });

        it('should return the minimum if greater than or equal to the maximum', function() {
            expect($.bound(20, 15, 5)).to.equal(5);
            expect($.bound(15, 15, 5)).to.equal(5);
        });

        it('should return the maximum - 1 when less than the minimum', function() {
            expect($.bound(1, 15, 5)).to.equal(14);
            expect($.bound(4, 15, 5)).to.equal(14);
            expect($.bound(5, 15, 5)).to.equal(5);
        });
    });

    describe('cache()', function() {
        it('should set a value if it doesn\'t exist', function() {
            var element = $('<span/>');

            expect(element.data('foo')).to.be.undefined;

            element.cache('foo', 'bar');

            expect(element.data('foo')).to.equal('bar');
        });

        it('should return the same value if it does exist', function() {
            var element = $('<span/>');

            element.cache('foo', 'bar');

            expect(element.data('foo')).to.equal('bar');

            element.cache('foo', 'baz');

            expect(element.data('foo')).to.equal('bar');
        });

        it('should set and return empty values (except nulls)', function() {
            var element = $('<span/>');

            element.cache('foo', false);

            expect(element.data('foo')).to.equal(false);

            element.cache('foo', true);

            expect(element.data('foo')).to.equal(false);
        });

        it('should allow nulls to be overwritten', function() {
            var element = $('<span/>');

            element.cache('foo', null);

            expect(element.data('foo')).to.equal(null);

            element.cache('foo', 'bar');

            expect(element.data('foo')).to.equal('bar');
        });

        it('should cache a value based on the return of a callback', function() {
            var element = $('<span/>');

            expect(element.data('foo')).to.be.undefined;

            element.cache('foo', function() {
                return 5 * 5;
            });

            expect(element.data('foo')).to.equal(25);
        });
    });
});

});