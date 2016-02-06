import React from 'react';
import { render } from 'enzyme';
import Breadcrumb from '../../src/components/breadcrumb';

describe('components/Breadcrumb', () => {
    describe('constructor()', () => {

    });

    describe('render()', () => {
        it('sets an id', () => {
            const wrapper = render(<Breadcrumb />);

            console.log(Object.keys(wrapper), wrapper);

            expect(wrapper.attr('id')).toBe(false);
        });

        it('sets a custom class', () => {
            const wrapper = render(<Breadcrumb className="not-breadcrumb" />);

            expect(wrapper.attr('class')).toBe(false);
        });

        it('sets a unique class', () => {

        });

        it('sets a size modifier class', () => {

        });

        it('sets a custom label', () => {

        });

        it('inherits fall-through props', () => {

        });
    });
});
