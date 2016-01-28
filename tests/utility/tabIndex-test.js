import tabIndex from '../../src/utility/tabIndex';

describe('utility/tabIndex()', () => {
    it('should increment the index each call', () => {
        let obj1 = {},
            obj2 = {};

        expect(tabIndex(obj1)).toBe(10);
        expect(tabIndex(obj2)).toBe(11);
    });

    it('should return the same index for the same object', () => {
        let obj1 = {},
            obj2 = {};

        expect(tabIndex(obj1)).toBe(12);
        expect(tabIndex(obj2)).toBe(13);
        expect(tabIndex(obj1)).toBe(12);
    });
});
