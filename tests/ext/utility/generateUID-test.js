import generateUID from '../../../src/ext/utility/generateUID';

describe('ext/utility/generateUID()', () => {
    it('should generate a random character string', () => {
        expect(generateUID()).toMatch(/^[a-z0-9]{5,8}$/);
    });

    it('should generate a unique ID', () => {
        expect(generateUID()).not.toBe(generateUID());
    });
});
