import ClassBuilder from '../../../src/ext/utility/ClassBuild';

describe('ext/utility/classBuilder()', () => {
    it('should combine all classes into a single string', () => {
        let builder = new ClassBuilder();

        builder.add('foo').add('foo', 'bar');

        expect(builder.toString()).toBe('foo foo-bar');
    });

    it('should cast non-strings', () => {
        let builder = new ClassBuilder();

        builder.add('foo').add(123).add(true);

        expect(builder.toString()).toBe('foo 123 true');
    });

    it('should loop through objects and append all classes that resolve as true', () => {
        let builder = new ClassBuilder();

        builder.add('foo').map({
            'is-active': true,
            'is-disabled': false
        }).add('bar');

        expect(builder.toString()).toBe('foo is-active bar');
    });
});
