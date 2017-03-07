import React from 'react';
import { shallow } from 'enzyme';
import BaseInput from '../../../src/components/Input/Input';
import { INPUT_CLASSES } from '../../../src/components/Input/types';

function Input(props) {
  return <BaseInput {...props} classNames={INPUT_CLASSES} />;
}

describe('components/Input/<Input/>', () => {
  it('creates a `uid` from `name`', () => {
    const wrapper = shallow(<Input name="foo" type="text" />).dive();

    expect(wrapper.instance().uid).toBe('foo');
  });

  it('creates a `uid` from `id`', () => {
    const wrapper = shallow(<Input name="foo" type="text" id="foobar" />).dive();

    expect(wrapper.instance().uid).toBe('foobar');
  });

  it('can mark a field as `disabled`', () => {
    const wrapper = shallow(<Input name="foo" type="text" disabled />).dive();

    expect(wrapper.prop('disabled')).toBe(true);
    expect(wrapper.prop('className')).toBe('input is-disabled');
  });

  it('can mark a field as `invalid`', () => {
    const wrapper = shallow(<Input name="foo" type="text" invalid />).dive();

    expect(wrapper.prop('invalid')).toBe(true);
    expect(wrapper.prop('className')).toBe('input is-invalid');
  });

  it('can mark a field as `required`', () => {
    const wrapper = shallow(<Input name="foo" type="text" required />).dive();

    expect(wrapper.prop('required')).toBe(true);
    expect(wrapper.prop('className')).toBe('input is-required');
  });

  it('can mark a field as `readOnly`', () => {
    const wrapper = shallow(<Input name="foo" type="text" readOnly />).dive();

    expect(wrapper.prop('readOnly')).toBe(true);
    expect(wrapper.prop('className')).toBe('input is-read-only');
  });

  it('doesnt apply classes if not native', () => {
    const wrapper = shallow(<Input name="foo" type="text" native={false} />).dive();

    expect(wrapper.prop('className')).toBe('');
  });

  describe('text', () => {
    it('renders an <input/> field with `type`', () => {
      const wrapper = shallow(<Input name="foo" type="text" />).dive();

      expect(wrapper.type()).toBe('input');
      expect(wrapper.prop('name')).toBe('foo');
      expect(wrapper.prop('id')).toBe('foo');
      expect(wrapper.prop('type')).toBe('text');
    });

    it('sets default value with `defaultValue`', () => {
      const wrapper = shallow(<Input name="foo" type="text" defaultValue="Toolkit" />).dive();

      expect(wrapper.state('value')).toBe('Toolkit');
    });

    it('emits `onChanging` event when data is changing', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="text" onChanging={spy} />).dive();

      wrapper.find('input').simulate('change', {
        target: { value: 'Toolkit' },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Toolkit',
      });
    });

    it('emits `onChanged` event when data has changed', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="text" onChanged={spy} />).dive();

      wrapper.find('input').simulate('change', {
        target: { value: 'Titon' },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Titon',
      });
    });

    it('emits `onChanged` event when mounting', () => {
      const spy = jest.fn();
      shallow(<Input name="foo" type="text" defaultValue="Titon" onChanged={spy} />).dive();

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Titon',
      });
    });
  });

  describe('textarea', () => {
    it('renders a <textarea/> field with `type`', () => {
      const wrapper = shallow(<Input name="foo" type="textarea" />).dive();

      expect(wrapper.type()).toBe('textarea');
      expect(wrapper.prop('name')).toBe('foo');
      expect(wrapper.prop('id')).toBe('foo');
      expect(wrapper.prop('type')).toBeUndefined();
    });

    it('sets default value with `defaultValue`', () => {
      const wrapper = shallow(<Input name="foo" type="textarea" defaultValue="Toolkit" />).dive();

      expect(wrapper.state('value')).toBe('Toolkit');
    });

    it('emits `onChanging` event when data is changing', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="textarea" onChanging={spy} />).dive();

      wrapper.find('textarea').simulate('change', {
        target: { value: 'Toolkit' },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Toolkit',
      });
    });

    it('emits `onChanged` event when data has changed', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="textarea" onChanged={spy} />).dive();

      wrapper.find('textarea').simulate('change', {
        target: { value: 'Titon' },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Titon',
      });
    });

    it('emits `onChanged` event when mounting', () => {
      const spy = jest.fn();
      shallow(<Input name="foo" type="textarea" defaultValue="Titon" onChanged={spy} />).dive();

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Titon',
      });
    });
  });

  describe('checkbox', () => {
    it('renders an <input/> field with type "checkbox"', () => {
      const wrapper = shallow(<Input name="foo" type="checkbox" />).dive();

      expect(wrapper.type()).toBe('input');
      expect(wrapper.prop('name')).toBe('foo');
      expect(wrapper.prop('id')).toBe('foo');
      expect(wrapper.prop('type')).toBe('checkbox');
    });

    it('renders `checked` and `multiple` states', () => {
      const wrapper = shallow(
        <Input
          name="foo"
          type="checkbox"
          defaultValue="foo"
          defaultChecked="foo"
          multiple
        />,
      ).dive();

      expect(wrapper.prop('multiple')).toBe(true);
      expect(wrapper.prop('checked')).toBe(true);
      expect(wrapper.prop('className')).toBe('input is-checked is-multiple');
    });

    it('errors if no `defaultValue`', () => {
      expect(() => {
        shallow(<Input name="foo" type="checkbox" multiple />).dive();
      }).toThrowError('A default value is required when using `multiple` checkboxes.');
    });

    it('sets default checked with `defaultChecked`', () => {
      const wrapper = shallow(<Input name="foo" type="checkbox" defaultChecked />).dive();

      expect(wrapper.state('checked')).toBe(true);
    });

    it('sets `multiple` default checked with `defaultChecked`', () => {
      const wrapper = shallow(
        <Input
          name="foo"
          type="checkbox"
          defaultValue="foo"
          defaultChecked="bar"
          multiple
        />,
      ).dive();

      expect(wrapper.state('checked')).toBe(false);
    });

    it('sets default value to 1', () => {
      const wrapper = shallow(<Input name="foo" type="checkbox" />).dive();

      expect(wrapper.state('value')).toBe('1');
    });

    it('sets default value with `defaultValue`', () => {
      const wrapper = shallow(<Input name="foo" type="checkbox" defaultValue="Toolkit" />).dive();

      expect(wrapper.state('value')).toBe('Toolkit');
    });

    it('emits `onChanging` event when data is changing', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="checkbox" onChanging={spy} />).dive();

      wrapper.find('input').simulate('change', {});

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: '1',
        checked: true,
      });
    });

    it('emits `onChanged` event when data has changed', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="checkbox" onChanged={spy} />).dive();

      wrapper.find('input').simulate('change', {});

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: '1',
        checked: true,
      });
    });

    it('emits `onChanged` event when mounting', () => {
      const spy = jest.fn();
      shallow(<Input name="foo" type="checkbox" defaultChecked onChanged={spy} />).dive();

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: '1',
        checked: true,
      });
    });

    it('toggles checked stated when changing input', () => {
      const wrapper = shallow(<Input name="foo" type="checkbox" />).dive();

      expect(wrapper.state('checked')).toBe(false);

      wrapper.find('input').simulate('change', {});

      expect(wrapper.state('checked')).toBe(true);

      wrapper.find('input').simulate('change', {});

      expect(wrapper.state('checked')).toBe(false);
    });
  });

  describe('radio', () => {
    it('renders an <input/> field with type "radio"', () => {
      const wrapper = shallow(<Input name="foo" type="radio" defaultValue="foo" />).dive();

      expect(wrapper.type()).toBe('input');
      expect(wrapper.prop('name')).toBe('foo');
      expect(wrapper.prop('id')).toBe('foo-foo');
      expect(wrapper.prop('type')).toBe('radio');
    });

    it('renders `checked` and `multiple` states', () => {
      const wrapper = shallow(
        <Input
          name="foo"
          type="radio"
          defaultValue="foo"
          defaultChecked="foo"
          multiple
        />,
      ).dive();

      expect(wrapper.prop('multiple')).toBe(true);
      expect(wrapper.prop('checked')).toBe(true);
      expect(wrapper.prop('className')).toBe('input is-checked is-multiple');
    });

    it('errors if no `defaultValue`', () => {
      expect(() => {
        shallow(<Input name="foo" type="radio" multiple />).dive();
      }).toThrowError('A default value is required when using radios.');
    });

    it('sets default checked with `defaultChecked`', () => {
      const wrapper = shallow(
        <Input
          name="foo"
          type="radio"
          defaultValue="foo"
          defaultChecked="bar"
        />,
      ).dive();

      expect(wrapper.state('checked')).toBe(false);
    });

    it('sets default value with `defaultValue`', () => {
      const wrapper = shallow(<Input name="foo" type="radio" defaultValue="Toolkit" />).dive();

      expect(wrapper.state('value')).toBe('Toolkit');
    });

    it('emits `onChanging` event when data is changing', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="radio" onChanging={spy} defaultValue="foo" />).dive();

      wrapper.find('input').simulate('change', {});

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'foo',
        checked: true,
      });
    });

    it('emits `onChanged` event when data has changed', () => {
      const spy = jest.fn();
      const wrapper = shallow(<Input name="foo" type="radio" onChanged={spy} defaultValue="bar" />).dive();

      wrapper.find('input').simulate('change', {});

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'bar',
        checked: true,
      });
    });

    it('emits `onChanged` event when mounting', () => {
      const spy = jest.fn();
      shallow(
        <Input name="foo" type="radio" defaultValue="bar" defaultChecked="bar" onChanged={spy} />,
      ).dive();

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'bar',
        checked: true,
      });
    });

    it('toggles checked stated when changing input', () => {
      const wrapper = shallow(<Input name="foo" type="radio" defaultValue="bar" />).dive();

      expect(wrapper.state('checked')).toBe(false);

      wrapper.find('input').simulate('change', {});

      expect(wrapper.state('checked')).toBe(true);

      wrapper.find('input').simulate('change', {});

      expect(wrapper.state('checked')).toBe(false);
    });
  });

  describe('select', () => {
    const options = [
      <option value="foo">Foo</option>,
      <option value="bar">Bar</option>,
      <option value="baz">Baz</option>,
    ];

    it('renders a <select/> field with child options', () => {
      const wrapper = shallow(<Input name="foo" type="select">{options}</Input>).dive();

      expect(wrapper.type()).toBe('select');
      expect(wrapper.prop('name')).toBe('foo');
      expect(wrapper.prop('id')).toBe('foo');
      expect(wrapper.prop('type')).toBeUndefined();
      expect(wrapper.find('option')).toHaveLength(3);
    });

    it('sets default value with `defaultValue`', () => {
      const wrapper = shallow(
        <Input name="foo" type="select" defaultValue="Toolkit">{options}</Input>,
      ).dive();

      expect(wrapper.state('value')).toBe('Toolkit');
    });

    it('converts `defaultValue` to an array if `multiple`', () => {
      const wrapper = shallow(
        <Input name="foo" type="select" defaultValue="Toolkit" multiple>{options}</Input>,
      ).dive();

      expect(wrapper.state('value')).toEqual(['Toolkit']);
    });

    it('emits `onChanging` event when data is changing', () => {
      const spy = jest.fn();
      const wrapper = shallow(
        <Input name="foo" type="select" onChanging={spy}>{options}</Input>,
      ).dive();

      wrapper.find('select').simulate('change', {
        target: { value: 'Toolkit' },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Toolkit',
      });
    });

    it('emits `onChanged` event when data has changed', () => {
      const spy = jest.fn();
      const wrapper = shallow(
        <Input name="foo" type="select" onChanged={spy}>{options}</Input>,
      ).dive();

      wrapper.find('select').simulate('change', {
        target: { value: 'Titon' },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Titon',
      });
    });

    it('emits `onChanged` event when mounting', () => {
      const spy = jest.fn();
      shallow(<Input name="foo" type="select" defaultValue="Titon" onChanged={spy} />).dive();

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: 'Titon',
      });
    });

    it('handles `multiple` values when changing', () => {
      const spy = jest.fn();
      const wrapper = shallow(
        <Input name="foo" type="select" onChanged={spy} multiple>{options}</Input>,
      ).dive();

      const opt1 = document.createElement('option');
      opt1.value = 'foo';

      const opt2 = document.createElement('option');
      opt2.value = 'bar';

      wrapper.find('select').simulate('change', {
        target: {
          selectedOptions: [opt1, opt2],
        },
      });

      expect(spy).toHaveBeenCalledWith({
        name: 'foo',
        value: ['foo', 'bar'],
      });
    });
  });
});
