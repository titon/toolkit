'use strict';

import Component from 'Component';

describe('Component', () => {
    let obj;

    beforeEach(() => {
        obj = new Component('#sandbox', {}, false);
    });

    describe('constructor()', () => {
        it('should merge options from the parent', () => {
            expect(obj.options).toEqual({
                cache: true,
                debug: false,
                ajax: {},
                context: null,
                className: ''
            });
        });
    });

    describe('formatID()', () => {
        it('should generate a unique ID', () => {
            expect(obj.formatID()).toBe('titon-component-2');
        });

        it('should append optional arguments to the ID', () => {
            expect(obj.formatID('a')).toBe('titon-component-3-a');
            expect(obj.formatID('a', 'b', 'c')).toBe('titon-component-3-a-b-c');
        });
    });

    describe('getAttributeName()', () => {
        it('should return an HTML compatible attribute', () => {
            obj.name = 'AttrComponent';

            expect(obj.getAttributeName()).toBe('attrcomponent');
        });
    });

    describe('getCssClassName()', () => {
        it('should return a CSS compatible class name', () => {
            obj.name = 'CssComponent';

            expect(obj.getCssClassName()).toBe('css-component');
        });
    });
});
