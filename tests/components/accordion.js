define([
    'jquery',
    '../../js/components/accordion'
], function($) {

describe('Toolkit.Accordion', function() {
    var element,
        accordion;

    before(function() {
        element = $('<ul class="accordion" id="accordion" data-accordion></ul>')
            .html(
                '<li>' +
                    '<header class="accordion-header" data-accordion-header>A</header>' +
                    '<section class="accordion-section" data-accordion-section>' +
                        '<div class="accordion-body">Foo</div>' +
                    '</section>' +
                '</li>' +
                '<li>' +
                    '<header class="accordion-header" data-accordion-header>B</header>' +
                    '<section class="accordion-section" data-accordion-section>' +
                        '<div class="accordion-body">Foo<br>Bar</div>' +
                    '</section>' +
                '</li>' +
                '<li>' +
                    '<header class="accordion-header" data-accordion-header>C</header>' +
                    '<section class="accordion-section" data-accordion-section>' +
                        '<div class="accordion-body">Foo<br>Bar<br>Baz</div>' +
                    '</section>' +
                '</li>'
            )
            .appendTo('body')
            .accordion();

        accordion = element.toolkit('accordion');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should find headers', function() {
            expect(accordion.headers.length).to.equal(3);
        });

        it('should find sections', function() {
            expect(accordion.sections.length).to.equal(3);
        });

        it('should set ARIA attributes', function() {
            expect(accordion.element.attr('role')).to.equal('tablist');

            expect(accordion.headers.eq(2).attr('role')).to.equal('tab');
            expect(accordion.headers.eq(2).aria('controls')).to.equal('toolkit-accordion-1-section-2');

            expect(accordion.sections.eq(1).attr('role')).to.equal('tabpanel');
            expect(accordion.sections.eq(1).aria('labelledby')).to.equal('toolkit-accordion-1-header-1');
        });
    });

    describe('calculate()', function() {
        it('should calculate and cache the heights of each section', function() {
            accordion.calculate();

            accordion.sections.each(function(i) {
                expect( $(this).data('accordion-height') ).to.be.above(30 + (i * 20));
            });
        });

        it('should allow for a custom calculate callback', function() {
            accordion.calculate(function(section) {
                return section.outerHeight() * 2;
            });

            accordion.sections.each(function(i) {
                expect( $(this).data('accordion-height') ).to.be.above(70 + (i * 20));
            });
        });
    });

    describe('show()', function() {
        it('should show one section and hide another', function(done) {
            accordion.jump(0);

            setTimeout(function() {
                expect(accordion.sections.eq(0).hasClass('show')).to.be.true;
                expect(accordion.sections.eq(1).hasClass('show')).to.be.false;
                expect(accordion.sections.eq(2).hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should set sections max height', function(done) {
            accordion.jump(1);

            setTimeout(function() {
                accordion.sections.each(function(i) {
                    var height = Math.ceil(parseInt($(this).css('max-height'), 10));

                    if (i === 1) {
                        expect(height).to.be.above(0);
                    } else {
                        expect(height).to.equal(0);
                    }
                });

                done();
            }, 350);
        });

        it('should toggle ARIA attributes', function(done) {
            accordion.jump(2);

            setTimeout(function() {
                expect(accordion.headers.eq(0).aria('expanded')).to.equal('false');
                expect(accordion.headers.eq(1).aria('expanded')).to.equal('false');
                expect(accordion.headers.eq(2).aria('expanded')).to.equal('true');

                expect(accordion.sections.eq(0).aria('hidden')).to.equal('true');
                expect(accordion.sections.eq(1).aria('hidden')).to.equal('true');
                expect(accordion.sections.eq(2).aria('hidden')).to.equal('false');

                done();
            }, 10);
        });

        it('should update the index', function() {
            expect(accordion.index).to.equal(2);

            accordion.jump(0);

            expect(accordion.index).to.equal(0);
        });

        it('should update the node with the shown header', function() {
            expect(accordion.node[0]).to.equal(accordion.headers[0]);

            accordion.jump(1);

            expect(accordion.node[0]).to.equal(accordion.headers[1]);
        });

        it('should set and remove active states from the header', function(done) {
            accordion.jump(2);

            setTimeout(function() {
                expect(accordion.headers.eq(0).hasClass('is-active')).to.be.false;
                expect(accordion.headers.eq(1).hasClass('is-active')).to.be.false;
                expect(accordion.headers.eq(2).hasClass('is-active')).to.be.true;

                done();
            }, 10);
        });
    });

    describe('show(): collapsible', function() {
        before(function() {
            accordion.options.collapsible = true;
        });

        it('should hide the section if it was previously opened', function(done) {
            accordion.jump(0);

            setTimeout(function() {
                expect(accordion.sections.eq(0).hasClass('show')).to.be.true;
                expect(accordion.sections.eq(1).hasClass('show')).to.be.false;
                expect(accordion.sections.eq(2).hasClass('show')).to.be.false;

                accordion.jump(0);

                setTimeout(function() {
                    expect(accordion.sections.eq(0).hasClass('show')).to.be.false;
                    expect(accordion.sections.eq(1).hasClass('show')).to.be.false;
                    expect(accordion.sections.eq(2).hasClass('show')).to.be.false;

                    done();
                }, 10);
            }, 10);
        });
    });

    describe('show(): multiple', function() {
        before(function() {
            accordion.options.multiple = true;
        });

        it('should allow multiple sections to be opened at once', function(done) {
            accordion.jump(1);

            setTimeout(function() {
                expect(accordion.sections.eq(0).hasClass('show')).to.be.false;
                expect(accordion.sections.eq(1).hasClass('show')).to.be.true;
                expect(accordion.sections.eq(2).hasClass('show')).to.be.false;

                accordion.jump(2);

                setTimeout(function() {
                    expect(accordion.sections.eq(0).hasClass('show')).to.be.false;
                    expect(accordion.sections.eq(1).hasClass('show')).to.be.true;
                    expect(accordion.sections.eq(2).hasClass('show')).to.be.true;

                    done();
                }, 10);
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            accordion.destroy();
        });

        it('should remove the object instance', function() {
            expect(element.toolkit('accordion')).to.be.null;
        });

        it('should remove active state from each item', function() {
            accordion.headers.each(function() {
                expect( $(this).parent().hasClass('is-active') ).to.be.false;
            });
        });

        it('should remove inline styles from sections', function() {
            accordion.sections.each(function() {
                expect( $(this).attr('style') ).to.not.be.ok;
            });
        });

        it('should reveal all sections', function(done) {
            setTimeout(function() {
                accordion.sections.each(function() {
                    expect( $(this).hasClass('show') ).to.be.true;
                });

                done();
            }, 10);
        });
    });
});

});