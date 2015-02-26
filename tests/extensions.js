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
    '../js/extensions/transitionend',
    '../js/components/component'
], function($) {

describe('Extensions', function() {
    describe('aria()', function() {
        it('should set aria-* attributes', function() {
            expect($('<span/>').aria('live', 'off').toString()).to.equal('<span aria-live="off"></span>');
        });

        it('should box true and false booleans', function() {
            expect($('<span/>').aria('expanded', true).toString()).to.equal('<span aria-expanded="true"></span>');
            expect($('<span/>').aria('expanded', false).toString()).to.equal('<span aria-expanded="false"></span>');
        });

        it('should set the custom `toggled` property', function() {
            var el = $('<span/>').aria('toggled', true);

            expect(el.aria('expanded')).to.equal('true');
            expect(el.aria('selected')).to.equal('true');
        });

        it('should not be set if `Toolkit.aria` is false', function() {
            Toolkit.aria = false;
            expect($('<span/>').aria('live', 'off').toString()).to.equal('<span></span>');

            Toolkit.aria = true;
            expect($('<span/>').aria('live', 'off').toString()).to.equal('<span aria-live="off"></span>');
        });

        it('should get aria-* attributes', function() {
            expect($('<span/>').aria('live', 'off').aria('live')).to.equal('off');
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
        var element;

        beforeEach(function() {
            element = $('<span/>');
        });

        it('should set a value if it doesn\'t exist', function() {
            expect(element.data('foo')).to.be.undefined;

            element.cache('foo', 'bar');

            expect(element.data('foo')).to.equal('bar');
        });

        it('should return the same value if it does exist', function() {
            element.cache('foo', 'bar');

            expect(element.data('foo')).to.equal('bar');

            element.cache('foo', 'baz');

            expect(element.data('foo')).to.equal('bar');
        });

        it('should set and return empty values (except nulls)', function() {
            element.cache('foo', false);

            expect(element.data('foo')).to.equal(false);

            element.cache('foo', true);

            expect(element.data('foo')).to.equal(false);
        });

        it('should allow nulls to be overwritten', function() {
            element.cache('foo', null);

            expect(element.data('foo')).to.equal(null);

            element.cache('foo', 'bar');

            expect(element.data('foo')).to.equal('bar');
        });

        it('should cache a value based on the return of a callback', function() {
            expect(element.data('foo')).to.be.undefined;

            element.cache('foo', function() {
                return 5 * 5;
            });

            expect(element.data('foo')).to.equal(25);
        });
    });

    describe('conceal()', function() {
        var element;

        beforeEach(function() {
            element = $('<span/>').appendTo('body');
        });

        afterEach(function() {
            element.remove();
        });

        it('should remove the `show` class and add the `hide` class', function() {
            element.addClass('show');

            expect(element.hasClass('show')).to.be.true;
            expect(element.hasClass('hide')).to.be.false;

            element.conceal();

            expect(element.hasClass('show')).to.be.false;
            expect(element.hasClass('hide')).to.be.true;
        });

        it('should toggle the `hidden` ARIA attribute', function(done) {
            element.conceal();

            expect(element.attr('aria-hidden')).to.equal('true');

            element.reveal();

            setTimeout(function() {
                expect(element.attr('aria-hidden')).to.equal('false');
                done();
            }, 10);
        });

        it('should set to display none when transition is complete', function(done) {
            element.addClass('show');

            expect(element.css('display')).to.equal('inline');

            element.conceal();

            setTimeout(function() {
                expect(element.css('display')).to.equal('none');
                done();
            }, 10);
        });

        it('should not set to display none if argument is true', function(done) {
            element.addClass('show');

            expect(element.css('display')).to.equal('inline');

            element.conceal(true);

            setTimeout(function() {
                expect(element.css('display')).to.equal('inline');
                done();
            }, 10);
        });
    });

    describe('debounce()', function() {
        it('should trigger the callback once the duration is up', function(done) {
            var count = 1;

            $.debounce(function() {
                count += 1;
            }, 150)();

            expect(count).to.equal(1);

            setTimeout(function() {
                expect(count).to.equal(2);
                done();
            }, 160);
        });
    });

    describe('reveal()', function() {
        var element;

        beforeEach(function() {
            element = $('<span/>').appendTo('body');
        });

        afterEach(function() {
            element.remove();
        });

        it('should remove the `hide` class and add the `show` class', function(done) {
            element.addClass('hide').hide();

            expect(element.hasClass('show')).to.be.false;
            expect(element.hasClass('hide')).to.be.true;

            element.reveal();

            setTimeout(function() {
                expect(element.hasClass('show')).to.be.true;
                expect(element.hasClass('hide')).to.be.false;
                done();
            }, 10);
        });

        it('should toggle the `hidden` ARIA attribute', function(done) {
            element.reveal();

            setTimeout(function() {
                expect(element.attr('aria-hidden')).to.equal('false');

                element.conceal();

                setTimeout(function() {
                    expect(element.attr('aria-hidden')).to.equal('true');
                    done();
                }, 10);
            }, 10);
        });

        it('should set to display block before the transition starts', function(done) {
            element.addClass('hide').hide();

            expect(element.css('display')).to.equal('none');

            element.reveal();

            setTimeout(function() {
                expect(element.css('display')).to.equal('inline');
                done();
            }, 10);
        });

        it('should not set to display block if argument is true', function(done) {
            element.addClass('hide').hide();

            expect(element.css('display')).to.equal('none');

            element.reveal(true);

            setTimeout(function() {
                expect(element.css('display')).to.equal('none');
                done();
            }, 10);
        });
    });

    describe('throttle()', function() {
        it('should delay callback execution to specific intervals', function(done) {
            var count = 1,
                start = Date.now(),
                callback = $.throttle(function() {
                    count += 1;
                }, 100);

            // Runs about 14 times
            var timer = setInterval(function() {
                if (Date.now() - start >= 1000) {
                    clearInterval(timer);
                } else {
                    callback();
                }
            }, 75);

            setTimeout(function() {
                expect(count).to.be.within(7, 8);
                done();
            }, 1800);
        });

        it('should trigger callback immediately if no delay is set', function() {
            var count = 1;

            $.throttle(function() {
                count += 1;
            })();

            expect(count).to.equal(2);
        });
    });

    describe('toString()', function() {
        var element = $('<span/>').addClass('foo bar').attr('id', 'baz').text('Element');

        it('should return the element markup as a string', function() {
            if (window.isFirefox) {
                expect(element.toString()).to.equal('<span id="baz" class="foo bar">Element</span>');
            } else {
                expect(element.toString()).to.equal('<span class="foo bar" id="baz">Element</span>');
            }
        });

        it('should return nested elements as well', function() {
            element.html('<b>Element</b>');

            if (window.isFirefox) {
                expect(element.toString()).to.equal('<span id="baz" class="foo bar"><b>Element</b></span>');
            } else {
                expect(element.toString()).to.equal('<span class="foo bar" id="baz"><b>Element</b></span>');
            }
        });
    });

    describe('toolkit()', function() {
        var instance = new Toolkit.Component(),
            element = $('<span/>');

        it('should return the instance from the `Toolkit.cache`', function() {
            expect(element.toolkit('test')).to.equal(null);

            Toolkit.cache['test:'] = instance;

            expect(element.toolkit('test')).to.equal(instance);

            delete Toolkit.cache['test:']; // Reset
        });

        it('should return the instance from the elements data cache', function() {
            expect(element.toolkit('test')).to.equal(null);

            element.data('toolkit.test', instance);

            expect(element.toolkit('test')).to.equal(instance);
        });

        it('should trigger a method on the instance', function() {
            expect(instance.enabled).to.be.false;

            element.toolkit('test', 'enable');

            expect(instance.enabled).to.be.true;
        });
    });

    describe('transitionend()', function() {
        var count, element;

        beforeEach(function() {
            count = 1;
            element = $('<span/>')
                .appendTo('body')
                .css('color', 'black')
                .on(Toolkit.transitionEnd, function() {
                    count += 1;
                });

            // We must set directly since jQuery doesn't support !important
            element[0].style.setProperty('transition', 'color 250ms', 'important');
        });

        afterEach(function() {
            element.remove();
        });

        it('should trigger the `transitionend` if no arguments are provided', function() {
            expect(count).to.equal(1);

            element.transitionend();

            expect(count).to.equal(2);
        });

        it('should trigger the callback when the transition is complete', function(done) {
            if (window.isPhantom) {
                done();
                return; // PhantomJS doesn't want to respect the transition settings
            }

            expect(count).to.equal(1);

            element.transitionend(function() {
                count += 1;
            }).css('color', 'red');

            expect(count).to.equal(1);

            setTimeout(function() {
                expect(count).to.equal(3);

                done();
            }, 300);
        });

        it('should trigger the callback immediately if no transition exists', function() {
            expect(count).to.equal(1);

            element[0].style.setProperty('transition', 'color 0s', 'important');

            element.transitionend(function() {
                count += 1;
            }).css('color', 'red');

            expect(count).to.equal(3);
        });
    });

    describe(':shown', function() {
        it('should return true if visibility is not hidden', function() {
            var element = $('<span/>').css('visibility', 'hidden');

            expect(element.is(':shown')).to.be.false;

            element.css('visibility', 'visible');

            expect(element.is(':shown')).to.be.true;
        });
    });
});

});
