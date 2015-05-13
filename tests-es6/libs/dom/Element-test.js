'use strict';

import Collection from 'libs/dom/Collection';
import Element from 'libs/dom/Element';
import 'polyfills/requestAnimationFrame';

describe('libs/dom/Element', () => {
    let element, obj;

    beforeEach(() => {
        element = createElement('div', {
            html: '<b>A</b><span>B</span><em>C</em>'
        });
        obj = new Element(element);
    });

    afterEach(() => {
        element.cleanup();
    });

    describe('addClass()', () => {
        it('should add the class to the queue', () => {
            expect(obj.queue.addClass).not.toBeDefined();

            obj.addClass('foo');

            expect(obj.queue.addClass).toBeDefined();
            expect(obj.queue.addClass).toBe('foo');
        });

        it('should add the class to the element when queue is processed', (done) => {
            obj.addClass('foo')
                .write()
                .then(() => {
                    expect(element.className).toBe('foo');
                    done();
                });
        });
    });

    describe('conceal()', () => {
        // TODO
    });

    describe('find()', () => {
        it('should find elements within the context of the element', () => {
            expect(obj.find('span')).toEqual(new Collection([
                element.childNodes[1]
            ]));
        });
    });

    describe('hasClass()', () => {
        it('should return `true` when the element has a specific class', () => {
            expect(obj.hasClass('foo')).toBe(false);

            element.className = 'foo';

            expect(obj.hasClass('foo')).toBe(true);
        });
    });

    describe('isVisible()', () => {
        it('should return `true` if the element is visible', () => {
            expect(obj.isVisible()).toBe(true);

            element.style.visibility = 'hidden';

            expect(obj.isVisible()).toBe(false);
        });
    });

    describe('processQueue()', () => {
        // TODO
    });

    describe('read()', () => {
        // TODO
    });

    describe('removeClass()', () => {
        it('should add the class to the queue', () => {
            expect(obj.queue.removeClass).not.toBeDefined();

            obj.removeClass('foo');

            expect(obj.queue.removeClass).toBeDefined();
            expect(obj.queue.removeClass).toBe('foo');
        });

        it('should remove the class from the element when queue is processed', (done) => {
            element.className = 'foo';

            obj.removeClass('foo')
                .write()
                .then(() => {
                    expect(element.className).toBe('');
                    done();
                });
        });
    });

    describe('resetQueue()', () => {
        it('should reset the queue to its default state', () => {
            let reset = { attributes: {}, properties: {}, styles: {} };

            obj.addClass('foo').setAttribute('id', 'bar');

            expect(obj.queue).not.toEqual(reset);

            obj.resetQueue();

            expect(obj.queue).toEqual(reset);
        });
    });

    describe('reveal()', () => {
        // TODO
    });

    describe('setAria()', () => {
        it('should add an attribute to the queue', () => {
            expect(obj.queue.attributes['aria-disabled']).not.toBeDefined();

            obj.setAria('disabled', 'true');

            expect(obj.queue.attributes['aria-disabled']).toBeDefined();
        });

        it('should set aria-* attributes', (done) => {
            obj.setAria('live', 'off')
                .write()
                .then(() => {
                    expect(element.getAttribute('aria-live')).toBe('off');
                    done();
                });
        });

        it('should box `true` and `false` booleans', (done) => {
            obj.setAria('selected', 'true')
                .setAria('expanded', 'false')
                .write()
                .then(() => {
                    expect(element.getAttribute('aria-expanded')).toBe('false');
                    expect(element.getAttribute('aria-selected')).toBe('true');
                    done();
                });
        });

        it('should set the custom `toggled` property', () => {
            obj.setAria('toggled', true);

            expect(obj.queue.attributes['aria-selected']).toBe('true');
            expect(obj.queue.attributes['aria-expanded']).toBe('true');
        });

        it('should not set if `Toolkit.aria` is `false`', () => {
            Toolkit.aria = false;

            obj.setAria('live', 'off');

            expect(obj.queue.attributes['aria-live']).not.toBeDefined();

            Toolkit.aria = true;

            obj.setAria('live', 'off');

            expect(obj.queue.attributes['aria-live']).toBeDefined();
        });
    });

    describe('setArias()', () => {
        it('should set multiple attributes at once', () => {
            obj.setArias({
                selected: true,
                expanded: false
            });

            expect(obj.queue.attributes['aria-selected']).toBe('true');
            expect(obj.queue.attributes['aria-expanded']).toBe('false');
        });
    });

    describe('setAttribute()', () => {
        it('should add an attribute to the queue', () => {
            expect(obj.queue.attributes.href).not.toBeDefined();

            obj.setAttribute('href', '/');

            expect(obj.queue.attributes.href).toBeDefined();
        });

        it('should set attributes to the element', (done) => {
            expect(element.getAttribute('data-foo')).toBeNull();

            obj.setAttribute('data-foo', 'bar')
                .write()
                .then(() => {
                    expect(element.getAttribute('data-foo')).toBe('bar');
                    done();
                });
        });
    });

    describe('setAttributes()', () => {
        it('should set multiple attributes at once', () => {
            obj.setAttributes({
                href: '/',
                'data-foo': 'bar'
            });

            expect(obj.queue.attributes.href).toBe('/');
            expect(obj.queue.attributes['data-foo']).toBe('bar');
        });
    });

    describe('setProperty()', () => {
        it('should add a property to the queue', () => {
            expect(obj.queue.properties.hidden).not.toBeDefined();

            obj.setProperty('hidden', true);

            expect(obj.queue.properties.hidden).toBeDefined();
        });

        it('should set properties to the element', (done) => {
            expect(element.hidden).toBe(false);

            obj.setProperty('hidden', true)
                .write()
                .then(() => {
                    expect(element.hidden).toBe(true);
                    done();
                });
        });
    });

    describe('setProperties()', () => {
        it('should set multiple properties at once', () => {
            obj.setProperties({
                disabled: true,
                selectedIndex: 5
            });

            expect(obj.queue.properties.disabled).toBe(true);
            expect(obj.queue.properties.selectedIndex).toBe(5);
        });
    });

    describe('setStyle()', () => {
        it('should add a style to the queue', () => {
            expect(obj.queue.styles.color).not.toBeDefined();

            obj.setStyle('color', 'red');

            expect(obj.queue.styles.color).toBeDefined();
        });

        it('should set styles to the element', (done) => {
            expect(element.style.color).toBe('');

            obj.setStyle('color', 'red')
                .write()
                .then(() => {
                    expect(element.style.color).toBe('red');
                    done();
                });
        });
    });

    describe('setStyles()', () => {
        it('should set multiple styles at once', () => {
            obj.setStyles({
                color: '#fff',
                backgroundColor: 'black'
            });

            expect(obj.queue.styles.color).toBe('#fff');
            expect(obj.queue.styles.backgroundColor).toBe('black');
        });
    });

    describe('write()', () => {
        // TODO
    });
});
