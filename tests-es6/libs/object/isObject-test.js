'use strict';

import isObject from 'libs/object/isObject';

describe('libs/object/isObject', () => {
    describe('isObject()', () => {
        it('should return true if an object', () => {
            /*eslint no-new-object: 0*/

            expect(isObject({})).toBe(true);
            expect(isObject(new Object())).toBe(true);

            expect(isObject([])).toBe(false);
            expect(isObject('')).toBe(false);
        });
    });
});
