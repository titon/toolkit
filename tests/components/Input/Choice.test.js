import React from 'react';
import { shallow } from 'enzyme';
import Choice from '../../../src/components/Input/Choice';

describe('components/Input/<Choice/>', () => {
  it('renders a choice field', () => {
    const child = <div>Foo</div>;
    const wrapper = shallow(<Choice inputID="foo">{child}</Choice>).dive();

    expect(wrapper.type()).toBe('label');
    expect(wrapper.contains(child)).toBe(true);
    expect(wrapper.prop('className')).toBe('input-choice');
    expect(wrapper.prop('htmlFor')).toBe('foo');
  });

  it('can make the choice small using `small`', () => {
    const wrapper = shallow(<Choice small inputID="foo">Foo</Choice>).dive();

    expect(wrapper.prop('className')).toBe('input-choice input-choice--small');
  });

  it('can make the choice large using `large`', () => {
    const wrapper = shallow(<Choice large inputID="foo">Foo</Choice>).dive();

    expect(wrapper.prop('className')).toBe('input-choice input-choice--large');
  });
});
