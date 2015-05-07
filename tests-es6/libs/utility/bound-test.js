'use strict';

import bound from 'libs/utility/bound';

describe('libs/utility/bound', () => {
    describe('bound()', () => {
        it('should return the same number if between bounds', () => {
            expect(bound(10, 15, 5)).toBe(10);
        });

        it('should return the minimum if greater than or equal to the maximum', () => {
            expect(bound(20, 15, 5)).toBe(5);
            expect(bound(15, 15, 5)).toBe(5);
        });

        it('should return the maximum - 1 when less than the minimum', () => {
            expect(bound(1, 15, 5)).toBe(14);
            expect(bound(4, 15, 5)).toBe(14);
            expect(bound(5, 15, 5)).toBe(5);
        });
    });
});
