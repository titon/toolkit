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
        it('should remove the `show` class and add the `hide` class', (done) => {
            element.className = 'show';

            expect(obj.hasClass('show')).toBe(true);
            expect(obj.hasClass('hide')).toBe(false);

            obj.conceal()
                .write()
                .then(() => {
                    expect(obj.hasClass('show')).toBe(false);
                    expect(obj.hasClass('hide')).toBe(true);
                    done();
                });
        });

        it('should toggle the `hidden` ARIA attribute', (done) => {
            expect(element.getAttribute('aria-hidden')).toBe(null);

            obj.conceal()
                .write()
                .then(() => {
                    expect(element.getAttribute('aria-hidden')).toBe('true');
                    done();
                });
        });

        it('should set to display none when transition is complete', (done) => {
            element.className = 'show';

            expect(element.style.display).toBe('');

            obj.conceal()
                .write()
                .then(() => {
                    expect(element.style.display).toBe('none');
                    done();
                });
        });

        it('should not set to display none if argument is true', (done) => {
            element.className = 'show';

            expect(element.style.display).toBe('');

            obj.conceal(true)
                .write()
                .then(() => {
                    expect(element.style.display).toBe('');
                    done();
                });
        });
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
        it('should throw an error if no element set', () => {
            let tempObj = new Element();

            expect(() => tempObj.processQueue()).toThrow(new Error('No element in container. Cannot process queue.'));
        });

        it('should add a class', () => {
            element.className = 'foo';

            expect(element.className).toBe('foo');

            obj.addClass('bar').processQueue();

            expect(element.className).toBe('foo bar');
        });

        it('should remove a class', () => {
            element.className = 'foo bar';

            expect(element.className).toBe('foo bar');

            obj.removeClass('foo').processQueue();

            expect(element.className).toBe('bar');
        });

        it('should set attributes', () => {
            expect(element.getAttribute('id')).toBe(null);
            expect(element.getAttribute('lang')).toBe(null);
            expect(element.getAttribute('role')).toBe(null);

            obj.setAttribute('id', 'foo').setAttributes({
                lang: 'en',
                role: 'main'
            }).processQueue();

            expect(element.getAttribute('id')).toBe('foo');
            expect(element.getAttribute('lang')).toBe('en');
            expect(element.getAttribute('role')).toBe('main');
        });

        it('should set properties', () => {
            expect(element.hidden).toBe(false);
            expect(element.tabIndex).toBe(-1);

            obj.setProperty('hidden', true).setProperties({
                tabIndex: 5
            }).processQueue();

            expect(element.hidden).toBe(true);
            expect(element.tabIndex).toBe(5);
        });

        it('should set styles', () => {
            expect(element.style.backgroundColor).toBe('');
            expect(element.style.boxShadow).toBe('');
            expect(element.style.height).toBe('');
            expect(element.style.borderWidth).toBe('');

            obj.setStyle('backgroundColor', '#000').setStyles({
                boxShadow: '5px 5px #fff',
                height: '100px',
                borderWidth: '1px'
            }).processQueue();

            expect(element.style.backgroundColor).toBe('rgb(0, 0, 0)');
            expect(element.style.boxShadow).toBe('rgb(255, 255, 255) 5px 5px');
            expect(element.style.height).toBe('100px');
            expect(element.style.borderWidth).toBe('1px');
        });

        it('should reset the queue once processed', () => {
            obj
                .addClass('bar')
                .setAria('hidden', true)
                .setAttribute('id', 'foo')
                .setProperty('hidden', false)
                .setStyle('color', 'red');

            expect(obj.queue).toEqual({
                attributes: {
                    'aria-hidden': 'true',
                    id: 'foo'
                },
                properties: {
                    hidden: false
                },
                styles: {
                    color: 'red'
                },
                addClass: 'bar'
            });

            obj.processQueue();

            expect(obj.queue).toEqual({
                attributes: {},
                properties: {},
                styles: {}
            });
        });
    });

    describe('read()', () => {
        it('should read values in the next frame through a callback function', (done) => {
            var value = 0;

            obj.read(function() {
                value = 1;
            }).then(() => {
                expect(value).toBe(1);
                done();
            });
        });

        it('should not allow nested callbacks', (done) => {
            var value = 0;

            obj.read(function() {
                value = 1;

                this.read(function() {
                    value = 2;
                });
            }).then(() => {
                expect(value).toBe(1);
                done();
            });
        });

        it('should reject if an exception is thrown', (done) => {
            obj.read(function() {
                throw new Error('Oops');
            }).then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(true).toBe(true);
                    done();
                });
        });

        it('should allow for writing after reading', (done) => {
            let height = 0, baseHeight = element.offsetHeight;

            obj.read((el) => {
                height = el.offsetHeight;
            }).write(() => {
                height = height * 2;
                obj.setStyle('height', height + 'px');
            });

            setTimeout(() => {
                expect(element.style.height).toBe(height + 'px');
                expect(height > baseHeight).toBeTruthy();
                done();
            }, 300);
        });
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
        it('should remove the `hide` class and add the `show` class', (done) => {
            element.className = 'hide';
            element.style.display = 'none';

            expect(obj.hasClass('show')).toBe(false);
            expect(obj.hasClass('hide')).toBe(true);

            obj.reveal()
                .write()
                .then(() => {
                    expect(obj.hasClass('show')).toBe(true);
                    expect(obj.hasClass('hide')).toBe(false);
                    done();
                });
        });

        it('should toggle the `hidden` ARIA attribute', (done) => {
            expect(element.getAttribute('aria-hidden')).toBe(null);

            obj.reveal()
                .write()
                .then(() => {
                    expect(element.getAttribute('aria-hidden')).toBe('false');
                    done();
                });
        });

        it('should set to display block before the transition starts', (done) => {
            element.className = 'hide';
            element.style.display = 'none';

            expect(element.style.display).toBe('none');

            obj.reveal()
                .write()
                .then(() => {
                    expect(element.style.display).toBe('');
                    done();
                });
        });

        it('should not set to display block if argument is true', (done) => {
            element.className = 'hide';
            element.style.display = 'none';

            expect(element.style.display).toBe('none');

            obj.reveal(true)
                .write()
                .then(() => {
                    expect(element.style.display).toBe('none');
                    done();
                });
        });
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
        it('should apply mutations in the next frame', (done) => {
            obj.addClass('foo');

            expect(element.className).toBe('');

            obj.write()
                .then(() => {
                    expect(element.className).toBe('foo');
                    done();
                });
        });

        it('should allow mutations to be set through a callback function', (done) => {
            obj.write(function() {
                this.addClass('foo');
            }).then(() => {
                expect(element.className).toBe('foo');
                done();
            });
        });

        it('should not allow nested callbacks', (done) => {
            obj.write(function() {
                this.addClass('foo').write(function() {
                    this.addClass('bar');
                });
            }).then(() => {
                expect(element.className).toBe('foo');
                done();
            });
        });

        it('should pass the `Element` instance through the promise as an argument', (done) => {
            obj.addClass('foo').write().then((objArg) => {
                expect(objArg).toEqual(obj);
                done();
            });
        });

        it('should reject if an exception is thrown', (done) => {
            let tempObj = new Element();

            tempObj.addClass('foo').write().then(
                () => {
                    expect(true).toBe(false);
                    done();
                },
                () => {
                    expect(true).toBe(true);
                    done();
                });
        });

        it('should allow for reading after writing', (done) => {
            var className = element.className;

            expect(className).toBe('');

            obj.addClass('foo')
                .write()
                .read(function() {
                    className = this.element.className;
                })
                    .then(() => {
                        expect(className).toBe('foo');
                        done();
                    });
        });
    });
});
