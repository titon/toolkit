import React from 'react';
import { shallow } from 'enzyme';
import Static from '../../../src/components/Input/Static';

describe('components/Input/<Static/>', () => {
  it('renders a static field', () => {
    const child = <div>Foo</div>;
    const wrapper = shallow(<Static>{child}</Static>).dive();

    expect(wrapper.type()).toBe('span');
    expect(wrapper.contains(child)).toBe(true);
    expect(wrapper.prop('className')).toBe('input-static');
  });

  it('can make the static small using `small`', () => {
    const wrapper = shallow(<Static small>Foo</Static>).dive();

    expect(wrapper.prop('className')).toBe('input-static input-static--small');
  });

  it('can make the static large using `large`', () => {
    const wrapper = shallow(<Static large>Foo</Static>).dive();

    expect(wrapper.prop('className')).toBe('input-static input-static--large');
  });
});
