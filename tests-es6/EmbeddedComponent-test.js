'use strict';

import EmbeddedComponent from 'EmbeddedComponent';

describe('EmbeddedComponent', () => {
    let obj;

    beforeEach(() => {
        obj = new EmbeddedComponent('#sandbox', {}, false);
    });

    afterEach(() => {
        cleanupElements();
    });

    describe('constructor()', () => {
        it('should merge options from the parent', () => {
            expect(obj.options).toEqual({
                cache: true,
                debug: false,
                ajax: {},
                context: null,
                className: '',
                namespace: ''
            });
        });
    });

    describe('formatNamespace()', () => {
        it('should generate a namespace selector', () => {
            expect(obj.formatNamespace()).toBe('[data-embeddedcomponent]');
            expect(obj.formatNamespace('element')).toBe('[data-embeddedcomponent-element]');
            expect(obj.formatNamespace('element', 'block')).toBe('[data-block-element]');

            obj.namespace = 'namespace';
            expect(obj.formatNamespace('element', 'block')).toBe('[data-block-element="namespace"]');
        });
    });

    describe('inheritOptions()', () => {
        it('should inherit options from the elements data atrributes', () => {
            expect(obj.options).toEqual({
                cache: true,
                debug: false,
                ajax: {},
                context: null,
                className: '',
                namespace: ''
            });

            obj.setElement(createElement('div', {
                'data-embeddedcomponent-classname': 'foo',
                'data-embeddedcomponent-debug': 'true'
            }));

            expect(obj.options).toEqual({
                cache: true,
                debug: true,
                ajax: {},
                context: null,
                className: 'foo',
                namespace: ''
            });
        });

        it('should inherit group options if a group data attribute is set', () => {
            obj.baseOptions.groups = obj.options.groups = {
                foo: {
                    className: 'foo',
                    foo: 456
                },
                bar: {
                    className: 'bar',
                    bar: 123,
                }
            };

            obj.setElement(createElement('div', {
                'data-embeddedcomponent-group': 'bar'
            }));

            expect(obj.options).toEqual({
                cache: true,
                debug: false,
                ajax: {},
                context: null,
                className: 'bar',
                namespace: '',
                groups: obj.baseOptions.groups,
                bar: 123
            });
        });
    });

    describe('setupProperties()', () => {
        it('should extract the namespace', () => {
            expect(obj.namespace).toBe('');

            obj.setElement(createElement('div', { 'data-embeddedcomponent': 'foo' }));
            obj.setupProperties();

            expect(obj.namespace).toBe('foo');
        });
    });
});
