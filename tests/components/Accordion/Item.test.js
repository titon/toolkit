import React from 'react';
import { shallow } from 'enzyme';
import Item from '../../../src/components/Accordion/Item';
import Header from '../../../src/components/Accordion/Header';
import Section from '../../../src/components/Accordion/Section';

describe('components/Accordion/<Item/>', () => {
  const context = {
    accordion: {
      uid: 'foo',
      isItemActive: index => index === 0,
    },
  };

  it('renders an item with a header and section', () => {
    const wrapper = shallow(<Item index={0} header="Title">Child</Item>).dive({ context });
    const header = wrapper.find(Header);
    const section = wrapper.find(Section);

    expect(wrapper.type()).toBe('li');
    expect(header.prop('index')).toBe(0);
    expect(header.prop('children')).toBe('Title');
    expect(section.prop('index')).toBe(0);
    expect(section.prop('children')).toBe('Child');
  });

  it('inherits `expanded` state from `index` prop', () => {
    const wrapper = shallow(<Item index={0} header="Title">Child</Item>).dive({ context });

    expect(wrapper.state('expanded')).toBe(true);
  });

  it('toggles `expanded` state based on `index` prop', () => {
    const wrapper = shallow(<Item index={0} header="Title">Child</Item>).dive({ context });

    expect(wrapper.state('expanded')).toBe(true);

    wrapper.setProps({
      index: 1,
    });

    expect(wrapper.state('expanded')).toBe(false);
  });

  it('toggles `expanded` state on header and section', () => {
    const wrapper = shallow(<Item index={0} header="Title">Child</Item>).dive({ context });

    expect(wrapper.find(Header).prop('active')).toBe(true);
    expect(wrapper.find(Section).prop('expanded')).toBe(true);

    wrapper.setState({
      expanded: false,
    });

    expect(wrapper.find(Header).prop('active')).toBe(false);
    expect(wrapper.find(Section).prop('expanded')).toBe(false);
  });

  it('emits `onShowing` and `onShowed` events when item is expanded', () => {
    const showing = jest.fn();
    const shown = jest.fn();
    const wrapper = shallow(
      <Item index={1} header="Title" onShowing={showing} onShown={shown}>Child</Item>,
    ).dive({ context });

    wrapper.setState({
      expanded: true,
    });

    expect(showing).toBeCalled();
    expect(shown).toBeCalled();
  });

  it('emits `onHiding` and `onHidden` events when item is collapsed', () => {
    const hiding = jest.fn();
    const hidden = jest.fn();
    const wrapper = shallow(
      <Item index={0} header="Title" onHiding={hiding} onHidden={hidden}>Child</Item>,
    ).dive({ context });

    wrapper.setState({
      expanded: false,
    });

    expect(hiding).toBeCalled();
    expect(hidden).toBeCalled();
  });
});
