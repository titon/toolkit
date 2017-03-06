import React from 'react';
import { shallow } from 'enzyme';
import Input from '../../../src/components/Input/Input';
import Checkbox from '../../../src/components/Input/Checkbox';

describe('components/Input/<Checkbox/>', () => {
  it('renders an <Input/> with type "checkbox"', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();

    expect(wrapper.find(Input).prop('type')).toBe('checkbox');
  });

  it('customizes the input class name', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();

    expect(wrapper.find(Input).prop('classNames').input).toBe('input input-checkbox');
  });
});
