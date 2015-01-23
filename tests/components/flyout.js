define([
    'jquery',
    '../../js/components/flyout'
], function($) {

describe('Toolkit.Flyout', function() {
    var element,
        flyout;

    before(function() {
        element = $('<a/>').addClass('js-flyout').text('Foobar').appendTo('body');

        flyout = $('.js-flyout').flyout(null, {
            mode: 'click'
        }).toolkit('flyout');

        flyout.load({
            "title": "Root",
            "url": "/",
            "children": [
                {
                    "title": "1",
                    "url": "/1",
                    "children": [
                        {
                            "title": "1 > 1",
                            "url": "/1/1"
                        }, {
                            "title": "1 > 2",
                            "url": "/1/2",
                            "children": [
                                {
                                    "title": "1 > 2 > 1",
                                    "url": "/1/2/1"
                                }, {
                                    "title": "1 > 2 > 2",
                                    "url": "/1/2/2"
                                }, {
                                    "title": "1 > 2 > 3",
                                    "url": "/1/2/3",
                                    "children": [
                                        {
                                            "title": "1 > 2 > 3 > 1",
                                            "url": "/1/2/3/1"
                                        }, {
                                            "title": "1 > 2 > 3 > 2",
                                            "url": "/1/2/3/2"
                                        }, {
                                            "title": "1 > 2 > 3 > 3",
                                            "url": "/1/2/3/3"
                                        }
                                    ]
                                }
                            ]
                        }, {
                            "title": "1 > 3",
                            "url": "/1/3"
                        }, {
                            "title": "1 > 4",
                            "url": "/1/4"
                        }
                    ]
                }, {
                    "title": "2",
                    "url": "/2"
                }, {
                    "title": "3",
                    "url": "/3"
                }, {
                    "title": "Heading"
                }, {
                    "title": "4",
                    "url": "/4",
                    "children": [
                        {
                            "title": "4 > 1",
                            "url": "/4/1"
                        }, {
                            "title": "4 > 2",
                            "url": "/4/2"
                        }, {
                            "title": "4 > 3",
                            "url": "/4/3"
                        }, {
                            "title": "4 > 4",
                            "url": "/4/4",
                            "children": [
                                {
                                    "title": "4 > 4 > 1",
                                    "url": "/4/4/1"
                                }, {
                                    "title": "4 > 4 > 2",
                                    "url": "/4/4/2"
                                }
                            ]
                        }
                    ]
                }, {
                    "title": "5",
                    "url": "/5"
                }
            ]
        });
    });

    after(function() {
        element.remove();
    });

    describe('show()', function() {
        it('should create a menu if it doesn\'t exist', function() {
            expect(Object.keys(flyout.elements)).to.have.length(0);

            element.attr('href', '/1').click();

            expect(Object.keys(flyout.elements)).to.have.length(1);
        });

        it('should not create a menu if there are no children', function() {
            expect(Object.keys(flyout.elements)).to.have.length(1);

            element.attr('href', '/5').click();

            expect(Object.keys(flyout.elements)).to.have.length(1);
        });
    });

    describe('_buildMenu()', function() {
        var menu, lis;

        before(function() {
            var keys = Object.keys(flyout.elements);

            menu = flyout.elements[keys[0]];
            lis = menu.find('> ul > li');
        });

        it('should set ARIA attributes', function() {
            expect(menu.attr('role')).to.equal('menu');
        });

        it('should set an `is-root` class on top level menus', function() {
            expect(menu.hasClass('is-root')).to.be.true;
        });

        it('should create list items', function() {
            expect(lis.length).to.equal(4);
        });

        it('should set ARIA attributes on list items', function() {
            expect(lis.eq(0).find('a').attr('role')).to.equal('menuitem');
        });

        it('should set a `has-children` class on list items that have children', function() {
            expect(lis.eq(0).hasClass('has-children')).to.be.false;
            expect(lis.eq(1).hasClass('has-children')).to.be.true;
        });
    });

    describe('destroy()', function() {
        before(function() {
            flyout.destroy();
        });

        it('should remove all menus', function() {
            expect($('body').find('> [data-flyout-menu]').length).to.equal(0);
        });
    });

});

});