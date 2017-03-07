import React from 'react';
import { shallow } from 'enzyme';
import Text from '../../../src/components/Input/Text';
import InputGroup from '../../../src/components/InputGroup/InputGroup';
import Addon from '../../../src/components/InputGroup/Addon';

describe('components/InputGroup/<InputGroup/>', () => {
  it('renders an input group', () => {
    const wrapper = shallow(<InputGroup><Text name="foo" /></InputGroup>).dive();

    expect(wrapper.type()).toBe('span');
    expect(wrapper.prop('className')).toBe('input-group');
    expect(wrapper.find(Text)).toHaveLength(1);
  });

  it('renders an input group with addons', () => {
    const wrapper = shallow(
      <InputGroup>
        <Addon>Prefix</Addon>
        <Text name="foo" />
        <Addon>Suffix</Addon>
      </InputGroup>,
    ).dive();

    expect(wrapper.find(Text)).toHaveLength(1);
    expect(wrapper.find(Addon)).toHaveLength(2);
  });
});
