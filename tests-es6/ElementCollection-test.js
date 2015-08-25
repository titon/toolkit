'use strict';

import Element from 'Element';
import ElementCollection from 'ElementCollection';
import find from 'extensions/dom/find';

describe('ElementCollection', () => {
    let element, obj;

    beforeEach(() => {
        element = createElement('div', {
            html: '<span>A</span><span>B</span><span>C</span><span>D</span><span>E</span>'
        });
        obj = find('#sandbox span');
    });

    afterEach(() => {
        element.cleanup();
    });

    describe('constructor()', () => {
        it('should convert all elements to `Element` classes', () => {
            let coll = new ElementCollection();
                coll.length = 5;
                coll.elements = [
                    new Element(element.childNodes[0]),
                    new Element(element.childNodes[1]),
                    new Element(element.childNodes[2]),
                    new Element(element.childNodes[3]),
                    new Element(element.childNodes[4])
                ];

            expect(obj).toEqual(coll);
        });

        it('should set the `length` based on the number of items in the array', () => {
            expect(obj.length).toBe(5);
        });
    });

    describe('each()', () => {
        it('should loop through each item and execute the callback function', () => {
            expect(element.childNodes[0].getAttribute('data-index')).toBe(null);
            expect(element.childNodes[2].getAttribute('data-index')).toBe(null);
            expect(element.childNodes[4].getAttribute('data-index')).toBe(null);

            obj.each(function(el, i) {
                el.element.setAttribute('data-index', i);
            });

            expect(element.childNodes[0].getAttribute('data-index')).toBe('0');
            expect(element.childNodes[2].getAttribute('data-index')).toBe('2');
            expect(element.childNodes[4].getAttribute('data-index')).toBe('4');
        });
    });

    describe('getCollectionMethods()', () => {
        it('should apply `Element` methods to all items through the `ElementCollection`', () => {
            expect(obj.elements[0].queue.addClass).toBeUndefined();
            expect(obj.elements[2].queue.addClass).toBeUndefined();
            expect(obj.elements[4].queue.addClass).toBeUndefined();

            obj.addClass('foo');

            expect(obj.elements[0].queue.addClass).toBe('foo');
            expect(obj.elements[2].queue.addClass).toBe('foo');
            expect(obj.elements[4].queue.addClass).toBe('foo');

            expect(obj.elements[1].queue.styles.color).toBeUndefined();
            expect(obj.elements[3].queue.styles.color).toBeUndefined();

            obj.setStyle('color', 'black');

            expect(obj.elements[1].queue.styles.color).toBe('black');
            expect(obj.elements[3].queue.styles.color).toBe('black');
        });
    });
});
