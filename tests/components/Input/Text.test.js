import React from 'react';
import { shallow } from 'enzyme';
import Input from '../../../src/components/Input/Input';
import Text from '../../../src/components/Input/Text';
import { INPUT_CLASSES } from '../../../src/components/Input/types';

describe('components/Input/<Text/>', () => {
  it('renders an <Input/> with a custom type', () => {
    const wrapper = shallow(<Text name="foo" type="email" />).dive();

    expect(wrapper.find(Input).prop('type')).toBe('email');
  });

  it('passes the class names as is', () => {
    const wrapper = shallow(<Text name="foo" type="text" />).dive();

    expect(wrapper.find(Input).prop('classNames')).toEqual(INPUT_CLASSES);
  });
});
