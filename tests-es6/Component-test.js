'use strict';

import Component from 'Component';

describe('Component', () => {
    let obj;

    beforeEach(() => {
        obj = new Component('', {}, false);
    });

    describe('buildID()', () => {
        it('should generate a unique ID', () => {
            expect(obj.buildID()).toBe('titon-component-1');
        });

        it('should append optional arguments to the ID', () => {
            expect(obj.buildID('a')).toBe('titon-component-2-a');
            expect(obj.buildID('a', 'b', 'c')).toBe('titon-component-2-a-b-c');
        });
    });

    describe('getAttributeName()', () => {
        it('should return an HTML compatible attribute', () => {
            obj.name = 'AttrComponent';

            expect(obj.getAttributeName()).toBe('attrcomponent');

            // Test symbol caching
            expect(obj.getAttributeName()).toBe('attrcomponent');
        });
    });

    describe('getCssClassName()', () => {
        it('should return a CSS compatible class name', () => {
            obj.name = 'CssComponent';

            expect(obj.getCssClassName()).toBe('css-component');

            // Test symbol caching
            expect(obj.getCssClassName()).toBe('css-component');
        });
    });
});
