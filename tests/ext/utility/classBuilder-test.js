import classBuilder from '../../../src/ext/utility/classBuilder';

describe('ext/utility/classBuilder()', () => {
    it('should combine all classes into a single string', () => {
        expect(classBuilder('foo', 'bar')).toBe('foo bar');
    });

    it('should ignore non-strings', () => {
        expect(classBuilder('foo', 123, true)).toBe('foo');
    });

    it('should loop through objects and append all classes that resolve as true', () => {
        expect(classBuilder('foo', { 'is-active': true }, 'bar', { 'is-disabled': false }))
            .toBe('foo is-active bar');
    });
});
