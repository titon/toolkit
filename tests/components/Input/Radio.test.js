import React from 'react';
import { shallow } from 'enzyme';
import Input from '../../../src/components/Input/Input';
import Radio from '../../../src/components/Input/Radio';

describe('components/Input/<Radio/>', () => {
  it('renders an <Input/> with type "radio"', () => {
    const wrapper = shallow(<Radio name="foo" />).dive();

    expect(wrapper.find(Input).prop('type')).toBe('radio');
  });

  it('customizes the input class name', () => {
    const wrapper = shallow(<Radio name="foo" />).dive();

    expect(wrapper.find(Input).prop('classNames').input).toBe('input input-radio');
  });
});
