define([
    'jquery',
    '../../js/components/matrix'
], function($) {

describe('Toolkit.Matrix', function() {
    var element,
        matrix;

    before(function() {
        element = $('<ul class="matrix"></ul>').appendTo('body').html(
            '<li>Foo</li>' +
            '<li>Bar</li>' +
            '<li>Baz</li>'
        ).matrix();

        matrix = element.toolkit('matrix');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should immediately organize items into the grid', function() {
            expect(element.css('height')).to.not.be.undefined;

            expect(matrix.items.eq(0).css('position')).to.equal('absolute');
            expect(matrix.items.eq(1).css('position')).to.equal('absolute');
            expect(matrix.items.eq(2).css('position')).to.equal('absolute');
        });
    });

    describe('append()', function() {
        var li;

        before(function() {
            li = $('<li/>').html('Oof');
            matrix.append(li);
        });

        it('should be hidden on insertion', function() {
            expect(li.hasClass('hide')).to.be.true;
        });

        it('should be placed in the container', function() {
            expect($.contains(element[0], li[0])).to.be.true;
        });

        it('should be appended to the `items` property', function() {
            expect(matrix.items.length).to.equal(4);
            expect(matrix.items.index(li)).to.equal(3);
        });

        it('should be shown once organized', function(done) {
            setTimeout(function() {
                expect(li.hasClass('hide')).to.be.false;

                done();
            }, 100);
        });
    });

    describe('prepend()', function() {
        var li;

        before(function() {
            li = $('<li/>').html('Rab');
            matrix.prepend(li);
        });

        it('should be hidden on insertion', function() {
            expect(li.hasClass('hide')).to.be.true;
        });

        it('should be placed in the container', function() {
            expect($.contains(element[0], li[0])).to.be.true;
        });

        it('should be appended to the `items` property', function() {
            expect(matrix.items.length).to.equal(5);
            expect(matrix.items.index(li)).to.equal(0);
        });

        it('should be shown once organized', function(done) {
            setTimeout(function() {
                expect(li.hasClass('hide')).to.be.false;

                done();
            }, 100);
        });
    });

    describe('refresh()', function() {
        it('should cache the width of each item', function() {
            expect(matrix.items.eq(2).data('matrix-column-width')).to.equal(22);
        });
    });

    describe('remove()', function() {
        it('should remove the item', function() {
            var li = matrix.items.eq(4);

            matrix.remove(li);

            expect(matrix.items.length).to.equal(4);
            expect(matrix.items.index(li)).to.equal(-1);
        });
    });

    describe('destroy()', function() {
        before(function() {
            matrix.destroy();
        });

        it('should remove inline styles from the container', function() {
            expect(element.attr('style')).to.not.be.ok;
        });

        it('should remove inline styles from each item', function() {
            expect(matrix.items.eq(0).attr('style')).to.not.be.ok;
            expect(matrix.items.eq(1).attr('style')).to.not.be.ok;
            expect(matrix.items.eq(2).attr('style')).to.not.be.ok;
        });
    });

});

});