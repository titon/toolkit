import React from 'react';
import { shallow } from 'enzyme';
import Header from '../../../src/components/Accordion/Header';

describe('components/Accordion/<Header/>', () => {
  const context = {
    accordion: {
      uid: 'foo',
      toggleItem() {},
    },
  };

  const classNames = {
    header: 'accordion__header',
    header_link: 'accordion__header-link',
    header__active: 'is-active',
  };

  it('renders a header', () => {
    const wrapper = shallow(
      <Header classNames={classNames} index={0} active={false}>
        Child
      </Header>
    , { context });

    expect(wrapper.prop('role')).toBe('tab');
    expect(wrapper.prop('id')).toBe('titon-accordion-header-foo-0');
    expect(wrapper.prop('className')).toBe('accordion__header');
  });

  it('renders a header link', () => {
    const wrapper = shallow(
      <Header classNames={classNames} index={0} active>
        Child
      </Header>
    , { context });
    const link = wrapper.find('a');

    expect(link).toHaveLength(1);
    expect(link.prop('children')).toBe('Child');
    expect(link.prop('className')).toBe('accordion__header-link');
  });

  it('sets active class', () => {
    const wrapper = shallow(
      <Header classNames={classNames} index={0} active>
        Child
      </Header>
    , { context });

    expect(wrapper.prop('className')).toBe('accordion__header is-active');
  });

  it('supports ARIA', () => {
    const wrapper = shallow(
      <Header classNames={classNames} index={0} active>
        Child
      </Header>
    , { context });

    expect(wrapper.prop('aria-controls')).toBe('titon-accordion-section-foo-0');
    expect(wrapper.prop('aria-selected')).toBe(true);
    expect(wrapper.prop('aria-expanded')).toBe(true);

    wrapper.setProps({
      active: false,
    });

    expect(wrapper.prop('aria-selected')).toBe(false);
    expect(wrapper.prop('aria-expanded')).toBe(false);
  });

  it('clicking header link triggers the context `toggleItem`', () => {
    const toggleItem = jest.fn();
    const preventDefault = jest.fn();
    const wrapper = shallow(
      <Header classNames={classNames} index={10} active>
        Child
      </Header>
    , {
      context: {
        accordion: {
          ...context.accordion,
          toggleItem,
        },
      },
    });

    wrapper.find('a').simulate('click', {
      preventDefault,
    });

    expect(preventDefault).toBeCalled();
    expect(toggleItem).toBeCalledWith(10);
  });

  it('clicking header link triggers `onClick` prop', () => {
    const onClick = jest.fn();
    const wrapper = shallow(
      <Header classNames={classNames} index={0} onClick={onClick} active>
        Child
      </Header>
    , { context });
    const event = {
      preventDefault() {},
    };

    wrapper.find('a').simulate('click', event);

    expect(onClick).toBeCalledWith(event);
  });
});
