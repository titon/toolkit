define([
    'jquery',
    '../../js/components/tab'
], function($) {

describe('Toolkit.Tab', function() {
    var element,
        tab;

    before(function() {
        element = $('<div class="tabs" data-tab></div>')
            .html(
                '<nav class="tab-nav" data-tab-nav>' +
                    '<ul>' +
                        '<li><a href="#a">A</a></li>' +
                        '<li><a href="#b">B</a></li>' +
                        '<li><a href="#c">C</a></li>' +
                    '</ul>' +
                '</nav>' +
                '<section class="tab-section" data-tab-section>Foo</section>' +
                '<section class="tab-section" data-tab-section>Bar</section>' +
                '<section class="tab-section" data-tab-section>Baz</section>'
            )
            .appendTo('body')
            .tab();

        tab = element.toolkit('tab');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should find a navigation', function() {
            expect(tab.nav.length).to.equal(1);
        });

        it('should find tabs', function() {
            expect(tab.tabs.length).to.equal(3);
        });

        it('should find sections', function() {
            expect(tab.sections.length).to.equal(3);
        });

        it('should set ARIA attributes', function() {
            expect(tab.nav.attr('role')).to.equal('tablist');

            expect(tab.tabs.eq(2).attr('id')).to.equal('toolkit-tab-1-tab-2');
            expect(tab.tabs.eq(2).attr('role')).to.equal('tab');
            expect(tab.tabs.eq(2).aria('controls')).to.equal('toolkit-tab-1-section-2');

            expect(tab.sections.eq(1).attr('id')).to.equal('toolkit-tab-1-section-1');
            expect(tab.sections.eq(1).attr('role')).to.equal('tabpanel');
            expect(tab.sections.eq(1).aria('labelledby')).to.equal('toolkit-tab-1-tab-1');
        });

        it('should open to the default index', function(done) {
            setTimeout(function() {
                expect(tab.sections.eq(0).hasClass('show')).to.be.true;
                expect(tab.sections.eq(1).hasClass('show')).to.be.false;
                expect(tab.sections.eq(2).hasClass('show')).to.be.false;

                done();
            }, 10);
        });
    });

    describe('show()', function() {
       it('should show one section and hide another', function(done) {
            tab.jump(1);

            setTimeout(function() {
                expect(tab.sections.eq(0).hasClass('show')).to.be.false;
                expect(tab.sections.eq(1).hasClass('show')).to.be.true;
                expect(tab.sections.eq(2).hasClass('show')).to.be.false;

                done();
            }, 10);
        });

        it('should toggle ARIA attributes', function(done) {
            tab.jump(2);

            setTimeout(function() {
                expect(tab.tabs.eq(0).aria('expanded')).to.equal('false');
                expect(tab.tabs.eq(1).aria('expanded')).to.equal('false');
                expect(tab.tabs.eq(2).aria('expanded')).to.equal('true');

                expect(tab.sections.eq(0).aria('hidden')).to.equal('true');
                expect(tab.sections.eq(1).aria('hidden')).to.equal('true');
                expect(tab.sections.eq(2).aria('hidden')).to.equal('false');

                done();
            }, 10);
        });

        it('should update the index', function() {
            expect(tab.index).to.equal(2);

            tab.jump(0);

            expect(tab.index).to.equal(0);
        });

        it('should update the node with the shown header', function() {
            expect(tab.node[0]).to.equal(tab.tabs[0]);

            tab.jump(1);

            expect(tab.node[0]).to.equal(tab.tabs[1]);
        });

        it('should set and remove active states from the tab', function(done) {
            tab.jump(2);

            setTimeout(function() {
                expect(tab.tabs.eq(0).hasClass('is-active')).to.be.false;
                expect(tab.tabs.eq(1).hasClass('is-active')).to.be.false;
                expect(tab.tabs.eq(2).hasClass('is-active')).to.be.true;

                done();
            }, 10);
        });
    });

    describe('show(): collapsible', function() {
        before(function() {
            tab.options.collapsible = true;
        });

        it('should hide the section if it was previously opened', function(done) {
            tab.jump(0);

            setTimeout(function() {
                expect(tab.sections.eq(0).hasClass('show')).to.be.true;
                expect(tab.sections.eq(1).hasClass('show')).to.be.false;
                expect(tab.sections.eq(2).hasClass('show')).to.be.false;

                tab.jump(0);

                setTimeout(function() {
                    expect(tab.sections.eq(0).hasClass('show')).to.be.false;
                    expect(tab.sections.eq(1).hasClass('show')).to.be.false;
                    expect(tab.sections.eq(2).hasClass('show')).to.be.false;

                    done();
                }, 10);
            }, 10);
        });
    });

    describe('destroy()', function() {
        before(function() {
            tab.destroy();
        });

        it('should open to the first section', function(done) {
            setTimeout(function() {
                expect(tab.sections.eq(0).hasClass('show')).to.be.true;
                expect(tab.sections.eq(1).hasClass('show')).to.be.false;
                expect(tab.sections.eq(2).hasClass('show')).to.be.false;

                done();
            }, 10);
        });
    });
});

});