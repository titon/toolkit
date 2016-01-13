/* eslint max-nested-callbacks: 0 */

import ClassBuilder from '../../../src/utility/ClassBuilder';

describe('ext/utility/ClassBuilder', () => {
    describe('constructor()', () => {
        it('should require a primary class', () => {
            expect(() => new ClassBuilder()).toThrowError('`ClassBuilder` requires a primary class name.');
        });
    });

    describe('add()', () => {
        it('should add strings, arrays, or objects', () => {
            let builder = new ClassBuilder('base');

            builder
                .add('foo')
                .add('foo', 'el')
                .add('foo', 'el', 'mod')
                .add('foo', '', 'mod')
                .add(['bar'])
                .add(['bar', 'el', 'mod'])
                .add({
                    block: 'baz',
                    element: 'el',
                    modifier: 'mod'
                });

            expect(builder.toString()).toBe('base foo foo-el foo-el--mod foo--mod bar bar-el--mod baz-el--mod');
        });

        it('should apply prefixes', () => {
            let builder = new ClassBuilder('base', 'pre-');

            builder
                .add('foo')
                .add('bar', '', '', false);

            expect(builder.toString()).toBe('pre-base pre-foo bar');
        });

        it('should cast non-strings', () => {
            let builder = new ClassBuilder('base');

            builder.add('foo').add(123).add(true);

            expect(builder.toString()).toBe('base foo 123 true');
        });
    });

    describe('map()', () => {
        it('should loop through objects and append all classes that resolve as true', () => {
            let builder = new ClassBuilder('base');

            builder.add('foo').map({
                'is-active': true,
                'is-disabled': false
            }).add('bar');

            expect(builder.toString()).toBe('base foo is-active bar');
        });

        it('should apply modifiers', () => {
            let builder = new ClassBuilder('base');

            builder.map({
                '@mod': true
            }).add('foo');

            expect(builder.toString()).toBe('base base--mod foo');
        });

        it('should handle prefixes correctly', () => {
            let builder = new ClassBuilder('base', 'pre-');

            builder.map({
                'is-active': true,
                '@mod': true
            }).add('foo');

            expect(builder.toString()).toBe('pre-base is-active pre-base--mod pre-foo');
        });
    });

    describe('mod()', () => {
        it('should append modifiers based on the primary class', () => {
            let builder = new ClassBuilder('base');

            builder.mod('foo').mod('bar');

            expect(builder.toString()).toBe('base base--foo base--bar');
        });
    });
});
