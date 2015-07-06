'use strict';

import Plugin from 'Plugin';

class ChildPlugin extends Plugin {
    name = 'Child';
    getDefaultOptions() {
        return ChildPlugin.options;
    }
}

ChildPlugin.options = {
    child: true,
    cache: false
};

describe('Plugin', () => {
    let obj, element;

    beforeEach(() => {
        obj = new Plugin();
        element = null;
    });

    afterEach(() => {
        if (element && element.cleanup) {
            element.cleanup();
        }
    });

    describe('constructor()', () => {
        it('should increase the count/UID for each instance', () => {
            expect(Plugin.count).toBe(1); // Increased from beforeEach()

            let obj1 = new Plugin(),
                obj2 = new Plugin();

            expect(obj1.uid).toBe(2);
            expect(obj2.uid).toBe(3);
            expect(Plugin.count).toBe(3);
        });

        it('should set class properties', () => {
            expect(obj.name).toBe('Plugin');
            expect(obj.enabled).toBe(false);
        });
    });

    describe('bindEvents()', () => {
        // TODO
    });

    describe('destroy()', () => {
        // TODO
    });

    describe('disable()', () => {
        it('should disable the plugin', () => {
            obj.enabled = true;

            expect(obj.enabled).toBe(true);

            obj.disable();

            expect(obj.enabled).toBe(false);
        });
    });

    describe('emit()', () => {
        let expected;

        beforeEach(() => {
            expected = [];

            obj.on('foo', multiplier => expected.push(1 * (multiplier || 1)));
            obj.on('foo', multiplier => expected.push(2 * (multiplier || 1)));
        });

        it('should trigger all listeners by type', () => {
            obj.emit('foo');

            expect(expected).toEqual([1, 2]);
        });

        it('should pass arguments to each listener', () => {
            obj.emit('foo', [3]);

            expect(expected).toEqual([3, 6]);
        });

        it('should trigger a custom DOM event from the element', () => {
            let context, args;

            obj.element = createElement('div');
            obj.element.addEventListener('foo.toolkit.plugin', e => {
                context = e.detail.context;
                args = e.detail.arguments;
                expected.push(5 * args[0]);
            });

            obj.emit('foo', [5]);

            expect(expected).toEqual([5, 10, 25]);
            expect(context).toEqual(obj);
            expect(args).toEqual([5]);

            obj.element.cleanup();
        });
    });

    describe('enable()', () => {
        it('should enable the plugin', () => {
            expect(obj.enabled).toBe(false);

            obj.enable();

            expect(obj.enabled).toBe(true);
        });
    });

    describe('getDefaultOptions()', () => {
        it('should return the static options', () => {
            expect(obj.getDefaultOptions()).toEqual({
                cache: true,
                debug: false
            });
        });
    });

    describe('initOptions()', () => {
        it('should inherit static options', () => {
            expect(obj.options).toEqual({});

            obj.initOptions();

            expect(obj.options).toEqual({
                cache: true,
                debug: false
            });
        });

        it('should merge with custom options', () => {
            expect(obj.options).toEqual({});

            obj.initOptions({
                cache: false,
                foo: 'bar'
            });

            expect(obj.options).toEqual({
                cache: false,
                debug: false,
                foo: 'bar'
            });
        });

        it('should merge and inherit parent options', () => {
            let obj2 = new ChildPlugin();

            expect(obj2.options).toEqual({});

            obj2.initOptions({
                foo: 'bar'
            });

            expect(obj2.options).toEqual({
                child: true,
                cache: false,
                debug: false,
                foo: 'bar'
            });
        });
    });

    describe('initElement()', () => {
        it('should throw an error', () => {
            expect(() => obj.initElement('#foo')).toThrow(new Error('No element defined. Please use the `#foo` selector.'));
        });
    });

    describe('mount()', () => {
        it('should not mount if no element defined', () => {
            expect(obj.mounted).toBe(false);

            obj.mount();

            expect(obj.mounted).toBe(false);
        });

        it('should mount the element', () => {
            element = document.createElement('div');
            obj.element = element;

            expect(obj.mounted).toBe(false);

            obj.mount();

            expect(obj.mounted).toBe(true);
            expect(element.parentNode).toEqual(document.body);
        });

        it('should not mount if already mounted', () => {
            let count = 0;

            element = document.createElement('div');

            obj.element = element;
            obj.on('mounted', () => count++);

            expect(obj.mounted).toBe(false);

            obj.mount();

            expect(obj.mounted).toBe(true);
            expect(count).toBe(1);

            obj.mount();

            expect(obj.mounted).toBe(true);
            expect(count).toBe(1);
        });
    });

    describe('on()', () => {
        // TODO
    });

    describe('off()', () => {
        // TODO
    });

    describe('setBinds()', () => {
        // TODO
    });

    describe('setElement()', () => {
        // TODO
    });

    describe('setOptions()', () => {
        // TODO
    });

    describe('setState()', () => {
        // TODO
    });

    describe('unmount()', () => {
        // TODO
    });
});
