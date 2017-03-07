import React from 'react';
import { shallow } from 'enzyme';
import Addon from '../../../src/components/InputGroup/Addon';

describe('components/InputGroup/<Addon/>', () => {
  it('renders an input group addon', () => {
    const wrapper = shallow(<Addon>Foo</Addon>).dive();

    expect(wrapper.type()).toBe('span');
    expect(wrapper.prop('className')).toBe('input-group__addon');
    expect(wrapper.prop('children')).toBe('Foo');
  });

  it('can make the addon small using `small`', () => {
    const wrapper = shallow(<Addon small>Foo</Addon>).dive();

    expect(wrapper.prop('className')).toBe('input-group__addon input-group__addon--small');
  });

  it('can make the addon large using `large`', () => {
    const wrapper = shallow(<Addon large>Foo</Addon>).dive();

    expect(wrapper.prop('className')).toBe('input-group__addon input-group__addon--large');
  });
});
