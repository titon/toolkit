import React from 'react';
import { shallow } from 'enzyme';
import Input from '../../../src/components/Input/Input';
import Textarea from '../../../src/components/Input/Textarea';

describe('components/Input/<Textarea/>', () => {
  it('renders an <Input/> with type "textarea"', () => {
    const wrapper = shallow(<Textarea name="foo" />).dive();

    expect(wrapper.find(Input).prop('type')).toBe('textarea');
  });

  it('customizes the input class name', () => {
    const wrapper = shallow(<Textarea name="foo" />).dive();

    expect(wrapper.find(Input).prop('classNames').input).toBe('input input-textarea');
  });
});
