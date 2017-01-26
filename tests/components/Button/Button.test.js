import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../../src/components/Button/Button';

describe('components/Button/<Button/>', () => {
  it('renders a button', () => {
    const wrapper = shallow(<Button>Foo</Button>).dive();

    expect(wrapper.type()).toBe('button');
    expect(wrapper.prop('type')).toBe('button');
    expect(wrapper.prop('role')).toBe('button');
    expect(wrapper.prop('className')).toBe('button');
    expect(wrapper.prop('children')).toBe('Foo');
  });

  it('renders an anchor if `href` is defined', () => {
    const wrapper = shallow(<Button href="/">Foo</Button>).dive();

    expect(wrapper.type()).toBe('a');
    expect(wrapper.prop('href')).toBe('/');
  });

  it('can change the button type using `type`', () => {
    const wrapper = shallow(<Button type="submit">Foo</Button>).dive();

    expect(wrapper.prop('type')).toBe('submit');
  });

  it('can make a button small using `small`', () => {
    const wrapper = shallow(<Button small>Foo</Button>).dive();

    expect(wrapper.prop('className')).toBe('button button--small');
  });

  it('can make a button large using `large`', () => {
    const wrapper = shallow(<Button large>Foo</Button>).dive();

    expect(wrapper.prop('className')).toBe('button button--large');
  });

  it('disables the button with `disabled`', () => {
    const wrapper = shallow(<Button>Foo</Button>).dive();

    expect(wrapper.prop('disabled')).toBe(false);

    wrapper.setProps({
      disabled: true,
    });

    expect(wrapper.prop('disabled')).toBe(true);
    expect(wrapper.prop('className')).toBe('button is-disabled');
  });

  it('doesnt disable if an anchor link', () => {
    const wrapper = shallow(<Button href="/">Foo</Button>).dive();

    expect(wrapper.prop('disabled')).toBeUndefined();

    wrapper.setProps({
      disabled: true,
    });

    expect(wrapper.prop('disabled')).toBeUndefined();
  });

  it('triggers pressed state', () => {
    const wrapper = shallow(<Button>Foo</Button>).dive();

    expect(wrapper.prop('aria-pressed')).toBe(false);
    expect(wrapper.prop('className')).toBe('button');

    wrapper.simulate('mousedown');

    expect(wrapper.prop('aria-pressed')).toBe(true);
    expect(wrapper.prop('className')).toBe('button is-pressed');
  });

  it('doesnt trigger pressed state if an anchor link', () => {
    const wrapper = shallow(<Button href="/">Foo</Button>).dive();

    expect(wrapper.prop('aria-pressed')).toBeUndefined();
    expect(wrapper.prop('className')).toBe('button');

    wrapper.simulate('mousedown');

    expect(wrapper.prop('aria-pressed')).toBeUndefined();
    expect(wrapper.prop('className')).toBe('button');
  });

  it('can pass and trigger `onClick`', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Button onClick={spy}>Foo</Button>).dive();

    wrapper.simulate('click');

    expect(spy).toHaveBeenCalled();
  });

  it('can pass and trigger `onMouseOver`', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Button onMouseOver={spy}>Foo</Button>).dive();

    wrapper.simulate('mouseover');

    expect(spy).toHaveBeenCalled();
  });

  it('can pass and trigger `onMouseOut`', () => {
    const spy = jest.fn();
    const wrapper = shallow(<Button onMouseOut={spy}>Foo</Button>).dive();

    wrapper.simulate('mouseout');

    expect(spy).toHaveBeenCalled();
  });
});
