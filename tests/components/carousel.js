define([
    'jquery',
    '../../js/components/carousel'
], function($) {

function createCarousel(options) {
    return $('<div class="carousel"></div>').html(
        '<div class="carousel-items">' +
            '<ul data-carousel-items>' +
                '<li><img src="images/carousel-1.png" alt=""></li>' +
                '<li><img src="images/carousel-2.png" alt=""></li>' +
                '<li><img src="images/carousel-3.png" alt=""></li>' +
                '<li><img src="images/carousel-4.png" alt=""></li>' +
                '<li><img src="images/carousel-5.png" alt=""></li>' +
            '</ul>' +
        '</div>' +
        '<div class="carousel-tabs">' +
            '<ol class="bullets" data-carousel-tabs>' +
                '<li><a href="javascript:;"></a></li>' +
                '<li><a href="javascript:;"></a></li>' +
                '<li><a href="javascript:;"></a></li>' +
                '<li><a href="javascript:;"></a></li>' +
                '<li><a href="javascript:;"></a></li>' +
            '</ol>' +
        '</div>' +
        '<a href="javascript:;" class="carousel-prev" data-carousel-prev></a>' +
        '<a href="javascript:;" class="carousel-next" data-carousel-next></a>'
    ).appendTo('body').carousel(options);
}

describe('Toolkit.Carousel', function() {
    var element,
        carousel;

    before(function() {
        element = createCarousel({
            autoCycle: false, // Don't auto cycle during tests
            infinite: false, // Don't use infinite scrolling for basic tests
            loop: false // Or looping
        });

        carousel = element.toolkit('carousel');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should set the animation class', function() {
            expect(element.hasClass('slide')).to.be.true;
        });

        it('should find the items container', function() {
            expect(carousel.container.length).to.equal(1);
        });

        it('should find the items', function() {
            expect(carousel.items.length).to.equal(5);
        });

        it('should find the tabs', function() {
            expect(carousel.tabs.length).to.equal(5);
        });

        it('should set ARIA attributes', function() {
            expect(element.aria('live')).to.equal('off');
        });

        it('should set required attributes on items', function() {
            expect(carousel.items.eq(0).attr('role')).to.equal('tabpanel');
            expect(carousel.items.eq(1).attr('id')).to.equal('toolkit-carousel-1-item-1');
            expect(carousel.items.eq(2).data('carousel-index')).to.equal(2);
            expect(carousel.items.eq(3).aria('hidden')).to.equal('true');
        });

        it('should set required attributes on tabs', function() {
            expect(carousel.tabs.eq(0).attr('role')).to.equal('tab');
            expect(carousel.tabs.eq(1).attr('id')).to.equal('toolkit-carousel-1-tab-1');
            expect(carousel.tabs.eq(2).data('carousel-index')).to.equal(2);
            expect(carousel.tabs.eq(3).aria('controls')).to.equal('toolkit-carousel-1-item-3');
        });

        it('should determine the correct dimension and position for `slide` animation', function() {
            expect(carousel._dimension).to.equal('width');
            expect(carousel._position).to.equal('left');
        });
    });

    describe('calculate()', function() {
        it('should calculate and set the size based on the dimensions', function() {
            carousel.calculate();

            var size = carousel._sizes[0].size;

            expect(carousel.container.css('width')).to.equal((size * 5) + 'px');
            expect(carousel.items.eq(0).css('width')).to.equal(size + 'px');
        });
    });

    describe('jump()', function() {
        it('should show the item and hide other items', function() {
            expect(carousel.items.eq(0).hasClass('is-active')).to.be.true;
            expect(carousel.items.eq(1).hasClass('is-active')).to.be.false;

            carousel.jump(1);

            expect(carousel.items.eq(0).hasClass('is-active')).to.be.false;
            expect(carousel.items.eq(1).hasClass('is-active')).to.be.true;
        });

        it('should update the tabs active state', function() {
            expect(carousel.tabs.eq(1).aria('selected')).to.equal('true');
            expect(carousel.tabs.eq(1).hasClass('is-active')).to.be.true;

            expect(carousel.tabs.eq(2).aria('selected')).to.equal('false');
            expect(carousel.tabs.eq(2).hasClass('is-active')).to.be.false;

            carousel.jump(2);

            expect(carousel.tabs.eq(1).aria('selected')).to.equal('false');
            expect(carousel.tabs.eq(1).hasClass('is-active')).to.be.false;

            expect(carousel.tabs.eq(2).aria('selected')).to.equal('true');
            expect(carousel.tabs.eq(2).hasClass('is-active')).to.be.true;
        });

        it('should set the index', function() {
            expect(carousel.index).to.equal(2);

            carousel.jump(3);

            expect(carousel.index).to.equal(3);
        });
    });

    describe('next()', function() {
        it('should go to the next slide', function() {
            expect(carousel.index).to.equal(3);

            carousel.next();

            expect(carousel.index).to.equal(4);
        });

        it('should set a `no-next` class if the end is reached', function() {
            carousel.jump(3);

            expect(element.hasClass('no-next')).to.be.false;
            expect(carousel.index).to.equal(3);

            carousel.next();

            expect(element.hasClass('no-next')).to.be.true;
            expect(carousel.index).to.equal(4);
        });
    });

    describe('prev()', function() {
        it('should go to the previous slide', function() {
            expect(carousel.index).to.equal(4);

            carousel.prev();

            expect(carousel.index).to.equal(3);
        });

        it('should set a `no-prev` class if the beginning is reached', function() {
            carousel.jump(1);

            expect(element.hasClass('no-prev')).to.be.false;
            expect(carousel.index).to.equal(1);

            carousel.prev();

            expect(element.hasClass('no-prev')).to.be.true;
            expect(carousel.index).to.equal(0);
        });
    });

    describe('start()', function() {
        it('should remove the `is-stopped` class', function() {
            carousel.stop();

            expect(element.hasClass('is-stopped')).to.be.true;

            carousel.start();

            expect(element.hasClass('is-stopped')).to.be.false;
        });

        it('should set the stopped property', function() {
            carousel.stop();

            expect(carousel.stopped).to.be.true;

            carousel.start();

            expect(carousel.stopped).to.be.false;
        });
    });

    describe('stop()', function() {
        it('should add the `is-stopped` class', function() {
            carousel.start();

            expect(element.hasClass('is-stopped')).to.be.false;

            carousel.stop();

            expect(element.hasClass('is-stopped')).to.be.true;
        });

        it('should set the stopped property', function() {
            carousel.start();

            expect(carousel.stopped).to.be.false;

            carousel.stop();

            expect(carousel.stopped).to.be.true;
        });
    });

    describe('destroy()', function() {
        before(function() {
            carousel.destroy();
        });

        it('should reset to the first item', function() {
            expect(carousel.index).to.equal(0);
        });
    });
});

describe('Toolkit.Carousel: infinite', function() {
    var element,
        carousel;

    before(function() {
        element = createCarousel({
            autoCycle: false, // Don't auto cycle during tests
            infinite: true,
            loop: false,
            animation: 'slide-up' // Test a different animation
        });

        carousel = element.toolkit('carousel');
    });

    after(function() {
        element.remove();
    });

    describe('constructor()', function() {
        it('should set the animation class', function() {
            expect(element.hasClass('slide-up')).to.be.true;
        });

        it('should find the items with clones', function() {
            expect(carousel.items.length).to.equal(7);
        });

        it('should create clone items', function() {
            expect(carousel.container.find('li.is-cloned').length).to.equal(2);
            expect(carousel.container.find('li:not(.is-cloned)').length).to.equal(5);
        });

        it('should determine the correct dimension and position for `slide-up` animation', function() {
            expect(carousel._dimension).to.equal('height');
            expect(carousel._position).to.equal('top');
        });
    });

    describe('calculate()', function() {
        it('should calculate and set the size based on the dimensions', function() {
            carousel.calculate();

            var size = carousel._sizes[0].size;

            expect(carousel.container.css('height')).to.equal((size * 7) + 'px');
            expect(carousel.items.eq(0).css('height')).to.equal(size + 'px');
        });
    });

    describe('destroy()', function() {
        before(function() {
            carousel.destroy();
        });

        it('should remove cloned items', function() {
            expect(carousel.container.find('li.is-cloned').length).to.equal(0);
        });
    });
});

describe('Toolkit.Carousel: loop', function() {
    var element,
        carousel;

    before(function() {
        element = createCarousel({
            autoCycle: false, // Don't auto cycle during tests
            infinite: true, // Toggled automatically
            loop: true,
            animation: 'fade', // Test a different animation
            itemsToShow: 10,
            itemsToCycle: 5
        });

        carousel = element.toolkit('carousel');
    });

    after(function() {
        carousel.destroy();
        element.remove();
    });

    describe('constructor()', function() {
        it('should set the animation class', function() {
            expect(element.hasClass('fade')).to.be.true;
        });

        it('should disabled `infinite` if the animation is a fade', function() {
            expect(carousel.options.infinite).to.be.false;
        });

        it('should set `itemsToShow` and `itemsToCycle` to 1', function() {
            expect(carousel.options.itemsToShow).to.equal(1);
            expect(carousel.options.itemsToCycle).to.equal(1);
        });

        it('should set no dimension and position for `fade` animation', function() {
            expect(carousel._dimension).to.equal('');
            expect(carousel._position).to.equal('');
        });
    });

    describe('next()', function() {
        it('should go to the first slide if the end is reached', function() {
            carousel.jump(4);

            expect(carousel.index).to.equal(4);

            carousel.next();

            expect(carousel.index).to.equal(0);
        });
    });

    describe('prev()', function() {
        it('should go to the last slide if the beginning is reached', function() {
            expect(carousel.index).to.equal(0);

            carousel.prev();

            expect(carousel.index).to.equal(4);
        });
    });
});

});
