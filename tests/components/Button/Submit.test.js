import React from 'react';
import { shallow } from 'enzyme';
import Submit from '../../../src/components/Button/Submit';

describe('components/Button/<Submit/>', () => {
  it('renders a submit button', () => {
    const wrapper = shallow(<Submit>Foo</Submit>).shallow().shallow();

    expect(wrapper.type()).toBe('button');
    expect(wrapper.prop('type')).toBe('submit');
    expect(wrapper.prop('className')).toBe('button');
    expect(wrapper.prop('children')).toBe('Foo');
  });

  it('forces button type to submit', () => {
    const wrapper = shallow(<Submit type="button">Foo</Submit>).shallow().shallow();

    expect(wrapper.prop('type')).toBe('submit');
  });
});
