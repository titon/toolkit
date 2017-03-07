import React from 'react';
import { shallow } from 'enzyme';
import Input from '../../../src/components/Input/Input';
import Checkbox from '../../../src/components/Checkbox/Checkbox';

describe('components/Checkbox/<Checkbox/>', () => {
  it('renders a custom checkbox and toggle elements', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();

    expect(wrapper.type()).toBe('span');
    expect(wrapper.prop('className')).toBe('checkbox');
    expect(wrapper.find('label').prop('className')).toBe('checkbox__toggle');
  });

  it('supports ARIA', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();

    expect(wrapper.prop('aria-checked')).toBe(false);
    expect(wrapper.prop('aria-disabled')).toBe(false);

    wrapper.setState({ checked: true });
    wrapper.setProps({ disabled: true });

    expect(wrapper.prop('aria-checked')).toBe(true);
    expect(wrapper.prop('aria-disabled')).toBe(true);
  });

  it('passes the correct props to <Input/>', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();
    const input = wrapper.find(Input);

    expect(input.prop('native')).toBe(false);
    expect(input.prop('type')).toBe('checkbox');
  });

  it('automatically sets the ID', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();

    expect(wrapper.prop('id')).toBe('titon-checkbox-foo');
    expect(wrapper.find(Input).prop('id')).toBe('foo');
    expect(wrapper.find('label').prop('htmlFor')).toBe('foo');
  });

  it('can customize the ID', () => {
    const wrapper = shallow(<Checkbox name="foo" id="custom-id" />).dive();

    expect(wrapper.prop('id')).toBe('titon-checkbox-custom-id');
    expect(wrapper.find(Input).prop('id')).toBe('custom-id');
    expect(wrapper.find('label').prop('htmlFor')).toBe('custom-id');
  });

  it('can mark a field as `checked`', () => {
    const wrapper = shallow(<Checkbox name="foo" defaultChecked />).dive();

    // We must wait for the willMount() to fire
    processInThread(() => {
      expect(wrapper.find(Input).prop('defaultChecked')).toBe(true);
      expect(wrapper.prop('className')).toBe('checkbox is-checked');
    });
  });

  it('can mark a field as `disabled`', () => {
    const wrapper = shallow(<Checkbox name="foo" disabled />).dive();

    expect(wrapper.find(Input).prop('disabled')).toBe(true);
    expect(wrapper.prop('className')).toBe('checkbox is-disabled');
  });

  it('can mark a field as `invalid`', () => {
    const wrapper = shallow(<Checkbox name="foo" invalid />).dive();

    expect(wrapper.find(Input).prop('invalid')).toBe(true);
    expect(wrapper.prop('className')).toBe('checkbox is-invalid');
  });

  it('can mark a field as `multiple`', () => {
    const wrapper = shallow(<Checkbox name="foo" multiple />).dive();

    expect(wrapper.find(Input).prop('multiple')).toBe(true);
    expect(wrapper.prop('className')).toBe('checkbox is-multiple');
  });

  it('can mark a field as `required`', () => {
    const wrapper = shallow(<Checkbox name="foo" required />).dive();

    expect(wrapper.find(Input).prop('required')).toBe(true);
    expect(wrapper.prop('className')).toBe('checkbox is-required');
  });

  it('can mark a field as `readOnly`', () => {
    const wrapper = shallow(<Checkbox name="foo" readOnly />).dive();

    expect(wrapper.find(Input).prop('readOnly')).toBe(true);
    expect(wrapper.prop('className')).toBe('checkbox is-read-only');
  });

  it('updates state when <Input/> changes', () => {
    const wrapper = shallow(<Checkbox name="foo" />).dive();

    expect(wrapper.state('checked')).toBe(false);

    wrapper.find(Input).shallow().find('input').simulate('change', {
      name: 'foo',
      value: '1',
      checked: true,
    });

    expect(wrapper.state('checked')).toBe(true);
  });

  it('calls `onChanged` when a change occurs', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Checkbox name="foo" onChanged={spy} />).dive();

    wrapper.find(Input).shallow().find('input').simulate('change', {
      name: 'foo',
      value: '1',
      checked: true,
    });

    expect(spy).toBeCalledWith({
      name: 'foo',
      value: '1',
      checked: true,
    });
  });
});
