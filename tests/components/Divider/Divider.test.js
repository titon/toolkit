import React from 'react';
import { shallow } from 'enzyme';
import ToolkitDivider from './../../../src/components/Divider/Divider';

describe('components/Divider/<ToolkitDivider />', () => {
  it('renders a divider line', () => {
    const wrapper = shallow(<ToolkitDivider />);

    expect(wrapper.prop()).toBe();
  });
});
