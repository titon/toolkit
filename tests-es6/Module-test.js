'use strict';

import Titon from 'Titon';
import Module from 'Module';
import Element from 'Element';

class ChildModule extends Module {
    name = 'ChildModule';
    getDefaultOptions() {
        return ChildModule.options;
    }
}

ChildModule.options = {
    child: true,
    cache: false
};

describe('Module', () => {
    let obj, element;

    beforeEach(() => {
        element = createElement('div', { id: 'module-test' });
        obj = new Module('#module-test', {}, false);
    });

    afterEach(() => {
        cleanupElements();
    });

    describe('constructor()', () => {
        it('should increase the count/UID for each instance', () => {
            let obj1 = new Module('#module-test', {}, false),
                obj2 = new Module('#module-test', {}, false);

            expect(obj1.uid).toBe(2);
            expect(obj2.uid).toBe(3);
        });

        it('should set class properties', () => {
            expect(obj.name).toBe('Module');
            expect(obj.enabled).toBe(false);
        });

        it('should set the selector used', () => {
            expect(obj.selector).toBe('#module-test');
            expect(obj.element.element).toEqual(element);
        });

        it('should allow elements to be set directly', () => {
            let obj = new Module(element, {}, false);

            expect(obj.selector).toBe('');
            expect(obj.element.element).toEqual(element);
        });
    });

    describe('disable()', () => {
        it('should disable the module', () => {
            obj.enabled = true;
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
            let context = null,
                args = [];

            obj.element = new Element(createElement('div'));
            obj.element.element.addEventListener('foo.titon.module', e => {
                context = e.detail.context;
                args = e.detail.arguments;
                expected.push(5 * args[0]);
            });

            obj.emit('foo', [5]);

            expect(expected).toEqual([5, 10, 25]);
            expect(context).toEqual(obj);
            expect(args).toEqual([5]);
        });
    });

    describe('enable()', () => {
        it('should enable the module', () => {
            expect(obj.enabled).toBe(false);

            obj.enable();

            expect(obj.enabled).toBe(true);
        });
    });

    describe('finalize()', () => {
        it('should disable the module', () => {
            obj.enabled = true;
            obj.finalize();

            expect(obj.enabled).toBe(false);
        });

        it('should unmount the element', () => {
            obj.mounted = true;
            obj.finalize();

            expect(obj.mounted).toBe(false);
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

    describe('mount()', () => {
        it('should not mount if no element defined', () => {
            obj.mounted = false;
            obj.element = null;
            obj.mount();

            expect(obj.mounted).toBe(false);
        });

        it('should not mount if the element already has a parent', () => {
            obj.mounted = false;
            obj.element = new Element(createElement('div')); // Mounted in sandbox

            expect(obj.mounted).toBe(false);

            obj.mount();

            expect(obj.mounted).toBe(false);
        });

        it('should mount the element', () => {
            obj.mounted = false;
            obj.element = new Element(createElement('div', {}, false)); // Not mounted

            expect(obj.mounted).toBe(false);

            obj.mount();

            expect(obj.mounted).toBe(true);
            expect(obj.element.element.parentNode).toEqual(document.body);
        });

        it('should not mount if already mounted', () => {
            let count = 0;

            obj.mounted = false;
            obj.element = new Element(createElement('div', {}, false));
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
        it('should add a listener', () => {
            let func1 = function() {};

            expect(obj.listeners.foo).toBeUndefined();

            obj.on('foo', func1);

            expect(obj.listeners.foo).toEqual([func1]);
        });

        it('should add multiple listeners', () => {
            let func1 = function() {},
                func2 = function() {},
                func3 = function() {};

            expect(obj.listeners.foo).toBeUndefined();

            obj.on('foo', func1);

            expect(obj.listeners.foo).toEqual([func1]);

            obj.on('foo', [func2, func3]);

            expect(obj.listeners.foo).toEqual([func1, func2, func3]);
        });
    });

    describe('off()', () => {
        it('should remove a matching listener', () => {
            let func1 = function() {},
                func2 = function() {},
                func3 = function() {};

            obj.on('foo', [func1, func2, func3]);

            expect(obj.listeners.foo).toEqual([func1, func2, func3]);

            obj.off('foo', func2);

            expect(obj.listeners.foo).toEqual([func1, func3]);
        });

        it('should remove all listeners if no match is passed', () => {
            let func1 = function() {},
                func2 = function() {},
                func3 = function() {};

            obj.on('foo', [func1, func2, func3]);

            expect(obj.listeners.foo).toEqual([func1, func2, func3]);

            obj.off('foo');

            expect(obj.listeners.foo).toBeUndefined();
        });
    });

    describe('processJSON()', function() {
        it('should trigger a function if `callback` is defined', function() {
            let count = 0;

            window.Titon.testProcess = function() {
                count = 5;
            };

            obj.processJSON({ foo: 'bar' });

            expect(count).toBe(0);

            obj.processJSON({ foo: 'bar', callback: 'Titon.testProcess' });

            expect(count).toBe(5);
        });
    });

    describe('setBinds()', () => {
        it('should parse out context, selector, and event', () => {
            let func = function() {};

            obj.setBinds({
                'click element': 'startup',
                'click container [data-selector]': func
            });

            expect(obj.binds).toEqual([
                ['click', 'element', '', obj.binds[0][3]],
                ['click', 'container', '[data-selector]', func]
            ]);
        });

        it('should replace tokens', () => {
            let func = function() {};

            obj.options.mode = 'click';
            obj.selector = '.foo';

            obj.setBinds({
                '{mode} element {selector}': func
            });

            expect(obj.binds).toEqual([
                ['click', 'element', '.foo', func]
            ]);
        });

        it('should convert string callbacks to a function', () => {
            obj.setBinds({
                'click element': 'startup'
            });

            expect(typeof obj.binds[0][3]).toBe('function');
        });

        it('should rename specific event names', () => {
            let func = function() {};

            obj.setBinds({
                'ready document': func
            });

            expect(obj.binds).toEqual([
                ['DOMContentLoaded', 'document', '', func]
            ]);
        });
    });

    describe('setElement()', () => {
        it('should set the element and wrap with `Element`', () => {
            let el = createElement('div');

            obj.setElement(el);

            expect(obj.element).toEqual(new Element(el));
        });

        it('should allow `Element` objects to be set directly', () => {
            let el = new Element(createElement('div'));

            obj.setElement(el);

            expect(obj.element).toEqual(el);
        });

        it('should throw `Error`s if invalid types are passed', () => {
            let error = 'Invalid element for Module. Must be an instance of Titon `Element` or a DOM `HTMLElement`.';

            expect(() => obj.setElement('')).toThrow(new Error(error));
            expect(() => obj.setElement(123)).toThrow(new Error(error));
            expect(() => obj.setElement(true)).toThrow(new Error(error));
        });
    });

    describe('setOptions()', () => {
        it('should merge with the previous options', () => {
            obj.options = { foo: 1 };

            obj.setOptions({
                bar: 2,
                baz: 3
            });

            expect(obj.options).toEqual({
                foo: 1,
                bar: 2,
                baz: 3
            });
        });

        it('should auto-subscribe listeners that start with `on`', () => {
            let func = function() {};

            expect(obj.listeners.init).toBeUndefined();

            obj.setOptions({
                onInit: func,
                foo: 'bar'
            });

            expect(obj.listeners.init).toEqual([func]);

            expect(obj.options).toEqual({
                cache: true,
                debug: false,
                foo: 'bar'
            });
        });
    });

    describe('setState()', () => {
        it('should allow functions to be passed', () => {
            expect(obj.state).toEqual({});

            obj.setState(function() {
                return { foo: 'bar' };
            });

            expect(obj.state).toEqual({
                foo: 'bar'
            });

            obj.setState(function(oldState) {
                return { foo: oldState.foo + 'baz' };
            });

            expect(obj.state).toEqual({
                foo: 'barbaz'
            });
        });

        it('should not allow non-object values', () => {
            expect(obj.state).toEqual({});

            obj.setState('foo');

            expect(obj.state).toEqual({});

            obj.setState(123);

            expect(obj.state).toEqual({});

            obj.setState(true);

            expect(obj.state).toEqual({});
        });

        it('should not emit `changed` events if no value changed', () => {
            let count = 0;

            obj.state = { foo: 'bar' };
            obj.on('changed', () => count++);

            expect(count).toBe(0);

            obj.setState({ foo: 'bar' });

            expect(count).toBe(0);
        });

        it('should pass current, new, and diff state to `changed` event', () => {
            let diffState = null,
                oldState = null,
                newState = null;

            obj.state = {
                foo: 123,
                bar: 'abc'
            };

            obj.on('changed', (diff, newObj, oldObj) => {
                diffState = diff;
                newState = newObj;
                oldState = oldObj;
            });

            obj.setState({
                foo: 123,
                bar: 'xyz',
                baz: true
            });

            expect(diffState).toEqual({
                bar: 'xyz',
                baz: true
            });

            expect(oldState).toEqual({
                foo: 123,
                bar: 'abc'
            });

            expect(newState).toEqual({
                foo: 123,
                bar: 'xyz',
                baz: true
            });
        });

        it('should pass current and new state to `changed:*` event', () => {
            let oldState = null,
                newState = null;

            obj.state = {
                foo: 123,
                bar: 'abc'
            };

            obj.on('changed:foo', (newValue, oldValue) => {
                newState = newValue;
                oldState = oldValue;
            });

            obj.setState({
                foo: 456
            });

            expect(oldState).toBe(123);
            expect(newState).toBe(456);
        });

        it('should update the `previousState` and `state` class properties', () => {
            obj.state = {
                foo: 123,
                bar: 'abc',
                baz: true
            };

            expect(obj.previousState).toEqual({});

            expect(obj.state).toEqual({
                foo: 123,
                bar: 'abc',
                baz: true
            });

            obj.setState({
                foo: 456,
                qux: []
            });

            expect(obj.previousState).toEqual({
                foo: 123,
                bar: 'abc',
                baz: true
            });

            expect(obj.state).toEqual({
                foo: 456,
                bar: 'abc',
                baz: true,
                qux: []
            });
        });

        it('should allow a key and value to be set through arguments', () => {
            expect(obj.state).toEqual({});

            obj.setState('foo', 'bar');

            expect(obj.state).toEqual({
                foo: 'bar'
            });
        });
    });

    describe('setupElement()', () => {
        it('should query the DOM for the element if a selector is passed', () => {
            obj.setupElement('#sandbox');

            expect(obj.element).toEqual(new Element(document.getElementById('sandbox')));
        });

        it('should throw a warning if no element is found', () => {
            expect(() => obj.setupElement('#missing-element')).toThrow(new Error('Element could not be found for Module.'));
        });
    });

    describe('setupOptions()', () => {
        it('should inherit static options', () => {
            expect(obj.options).toEqual({
                cache: true,
                debug: false
            }); // From constructor
        });

        it('should merge with custom options', () => {
            expect(obj.options).toEqual({
                cache: true,
                debug: false
            });

            obj.setupOptions({
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
            let obj2 = new ChildModule('#module-test', {}, false);

            expect(obj2.options).toEqual({
                cache: false,
                debug: false,
                child: true
            });

            obj2.setupOptions({
                foo: 'bar'
            });

            expect(obj2.options).toEqual({
                child: true,
                cache: false,
                debug: false,
                foo: 'bar'
            });
        });

        it('should keep a reference to the original base options', () => {
            obj.setupOptions({
                foo: 'bar'
            });

            expect(obj.baseOptions).toEqual({
                cache: true,
                debug: false
            });

            expect(obj.options).toEqual({
                cache: true,
                debug: false,
                foo: 'bar'
            });
        });
    });

    describe('unmount()', () => {
        it('should not unmount if no element defined', () => {
            obj.mounted = false;
            obj.element = null;
            obj.unmount();

            expect(obj.mounted).toBe(false);
        });

        it('should not unmount if no parent element', () => {
            obj.mounted = true;
            obj.element = new Element(createElement('div', {}, false));

            expect(obj.mounted).toBe(true);

            obj.unmount();

            expect(obj.mounted).toBe(true);
        });

        it('should unmount the element', () => {
            obj.mounted = true;
            obj.element = new Element(createElement('div'));

            expect(obj.mounted).toBe(true);

            obj.unmount();

            expect(obj.mounted).toBe(false);
            expect(obj.element.element.parentNode).toBe(null);
        });

        it('should not unmount if already unmounted', () => {
            let count = 0;

            obj.mounted = true;
            obj.element = new Element(createElement('div'));

            obj.on('unmounted', () => count++);

            expect(obj.mounted).toBe(true);

            obj.unmount();

            expect(obj.mounted).toBe(false);
            expect(count).toBe(1);

            obj.unmount();

            expect(obj.mounted).toBe(false);
            expect(count).toBe(1);
        });
    });
});
