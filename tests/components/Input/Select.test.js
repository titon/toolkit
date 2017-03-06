import React from 'react';
import { shallow } from 'enzyme';
import Input from '../../../src/components/Input/Input';
import Select from '../../../src/components/Input/Select';

describe('components/Input/<Select/>', () => {
  const options = [
    { label: 'Foo', value: 'foo' },
    { label: 'Bar', value: 'bar', disabled: true },
    { label: 'Baz', value: 'baz' },
  ];

  const optionsWithGroups = [
    ...options,
    {
      label: 'Group',
      options: [
        { label: 'Qux', value: 'qux' },
        { label: 'Oof', value: 'oof', disabled: true },
      ],
    },
    {
      label: 'Group Disabled',
      disabled: true,
      options: [],
    },
  ];

  it('renders an <Input/> with type "select"', () => {
    const wrapper = shallow(<Select name="foo" options={[]} />).dive();

    expect(wrapper.find(Input).prop('type')).toBe('select');
  });

  it('renders a list of options with `options`', () => {
    const wrapper = shallow(<Select name="foo" options={options} />).dive();
    const opts = wrapper.find('option');

    expect(opts).toHaveLength(3);

    expect(opts.at(0).prop('value')).toBe('foo');
    expect(opts.at(1).prop('value')).toBe('bar');
    expect(opts.at(2).prop('value')).toBe('baz');

    expect(opts.at(0).prop('children')).toBe('Foo');
    expect(opts.at(1).prop('children')).toBe('Bar');
    expect(opts.at(2).prop('children')).toBe('Baz');
  });

  it('renders optgroups with `options`', () => {
    const wrapper = shallow(<Select name="foo" options={optionsWithGroups} />).dive();
    const opts = wrapper.find('option');
    const groups = wrapper.find('optgroup');

    expect(opts).toHaveLength(5);
    expect(groups).toHaveLength(2);

    expect(groups.at(0).prop('label')).toBe('Group');
    expect(groups.at(1).prop('label')).toBe('Group Disabled');

    // Check nested options
    const groupOpts = groups.at(0).find('option');

    expect(groupOpts.at(0).prop('value')).toBe('qux');
    expect(groupOpts.at(1).prop('value')).toBe('oof');

    expect(groupOpts.at(0).prop('children')).toBe('Qux');
    expect(groupOpts.at(1).prop('children')).toBe('Oof');
  });

  it('supports disabled options in `options`', () => {
    const wrapper = shallow(<Select name="foo" options={options} />).dive();
    const opts = wrapper.find('option');

    expect(opts.at(0).prop('disabled')).toBe(false);
    expect(opts.at(1).prop('disabled')).toBe(true);
    expect(opts.at(2).prop('disabled')).toBe(false);
  });

  it('supports disabled optgroups in `options`', () => {
    const wrapper = shallow(<Select name="foo" options={optionsWithGroups} />).dive();
    const opts = wrapper.find('optgroup');

    expect(opts.at(0).prop('disabled')).toBe(false);
    expect(opts.at(1).prop('disabled')).toBe(true);

    // Nested options too
    expect(opts.at(0).find('option').at(0).prop('disabled')).toBe(false);
    expect(opts.at(0).find('option').at(1).prop('disabled')).toBe(true);
  });

  it('customizes the input class name', () => {
    const wrapper = shallow(<Select name="foo" options={[]} />).dive();

    expect(wrapper.find(Input).prop('classNames').input).toBe('input input-select');
  });
});
