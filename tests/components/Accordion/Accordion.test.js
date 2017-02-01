import React from 'react';
import { shallow } from 'enzyme';
import Accordion from '../../../src/components/Accordion/Accordion';
import Item from '../../../src/components/Accordion/Item';

describe('components/Accordion/<Accordion/>', () => {
  let wrapper;
  let instance;

  beforeEach(() => {
    wrapper = shallow(
      <Accordion>
        <Item header="Foo">Foo child</Item>
        <Item header="Bar">Bar child</Item>
        <Item header="Baz">Baz child</Item>
      </Accordion>,
    ).dive();
    instance = wrapper.instance();
  });

  it('renders a list', () => {
    expect(wrapper.type()).toBe('ul');
    expect(wrapper.prop('id')).toMatch(/^titon-accordion-/);
    expect(wrapper.prop('className')).toBe('accordion');
    expect(wrapper.prop('aria-live')).toBe('off');
  });

  it('sets `multiple` class name', () => {
    wrapper = shallow(
      <Accordion multiple>
        <Item header="Foo">Foo child</Item>
        <Item header="Bar">Bar child</Item>
        <Item header="Baz">Baz child</Item>
      </Accordion>,
    ).dive();

    expect(wrapper.prop('className')).toBe('accordion is-multiple');
  });

  it('sets `collapsible` class name', () => {
    wrapper = shallow(
      <Accordion collapsible>
        <Item header="Foo">Foo child</Item>
        <Item header="Bar">Bar child</Item>
        <Item header="Baz">Baz child</Item>
      </Accordion>,
    ).dive();

    expect(wrapper.prop('className')).toBe('accordion is-collapsible');
  });

  describe('componentWillMount()', () => {
    it('sets default index on mount', () => {
      wrapper.setProps({
        defaultIndex: 2,
      });
      instance.componentWillMount();

      expect(wrapper.state('indices').has(2)).toBe(true);
    });
  });

  describe('shouldComponentUpdate()', () => {
    it('returns true when `multiple`', () => {
      expect(instance.shouldComponentUpdate({ multiple: true })).toBe(true);
    });

    it('returns true when indices are different', () => {
      expect(instance.shouldComponentUpdate({}, { indices: new Set([1]) })).toBe(true);
    });

    it('returns false when not `multiple` and same indices', () => {
      expect(instance.shouldComponentUpdate({
        multiple: false,
      }, {
        indices: instance.state.indices,
      })).toBe(false);
    });
  });

  describe('hideItem()', () => {
    beforeEach(() => {
      wrapper.state('indices').add(1).add(2).add(3);
    });

    it('removes an index from the list', () => {
      instance.hideItem(2);

      expect(Array.from(wrapper.state('indices'))).toEqual([0, 1, 3]);
    });

    it('removes multiple indices from the list', () => {
      instance.hideItem([1, 3, 5]);

      expect(Array.from(wrapper.state('indices'))).toEqual([0, 2]);
    });

    it('does nothing if the index doesnt exist', () => {
      instance.hideItem(5);

      expect(Array.from(wrapper.state('indices'))).toEqual([0, 1, 2, 3]);
    });
  });

  describe('isItemCollapsible()', () => {
    it('returns true if the index is active and `multiple` is enabled', () => {
      wrapper.setProps({
        multiple: true,
      });
      wrapper.state('indices').add(1);

      expect(instance.isItemCollapsible(1)).toBe(true);
    });

    it('returns true if the index is active and `collapsible` is enabled', () => {
      wrapper.setProps({
        collapsible: true,
      });
      wrapper.state('indices').add(1);

      expect(instance.isItemCollapsible(1)).toBe(true);
    });

    it('returns false if neither prop is enabled', () => {
      wrapper.state('indices').add(1);

      expect(instance.isItemCollapsible(1)).toBe(false);
    });

    it('returns false if index is not active', () => {
      wrapper.setProps({
        multiple: true,
        collapsible: true,
      });

      expect(instance.isItemCollapsible(1)).toBe(false);
    });
  });

  describe('isItemActive()', () => {
    it('returns a boolean if the index exists', () => {
      wrapper.state('indices').add(5);

      expect(instance.isItemActive(1)).toBe(false);
      expect(instance.isItemActive(5)).toBe(true);
    });

    it('supports multiple indices', () => {
      wrapper.state('indices').add(1).add(5);

      expect(instance.isItemActive(1)).toBe(true);
      expect(instance.isItemActive(5)).toBe(true);
    });
  });

  describe('showItem()', () => {
    beforeEach(() => {
      // Remove default index for easier testing
      wrapper.state('indices').delete(0);
    });

    it('adds an index and replaces previous index', () => {
      instance.showItem(1);

      expect(Array.from(wrapper.state('indices'))).toEqual([1]);

      instance.showItem(2);

      expect(Array.from(wrapper.state('indices'))).toEqual([2]);
    });

    it('adds many indices if `multiple` is on', () => {
      wrapper.setProps({
        multiple: true,
      });
      instance.showItem(0);
      instance.showItem(1);

      expect(Array.from(wrapper.state('indices'))).toEqual([0, 1]);

      instance.showItem(2);

      expect(Array.from(wrapper.state('indices'))).toEqual([0, 1, 2]);
    });

    it('must be greater than or equal to 0', () => {
      instance.showItem(-1);

      expect(Array.from(wrapper.state('indices'))).toEqual([]);

      instance.showItem(0);

      expect(Array.from(wrapper.state('indices'))).toEqual([0]);
    });

    it('must be less than or equal to the number of children', () => {
      instance.showItem(3);

      expect(Array.from(wrapper.state('indices'))).toEqual([]);

      instance.showItem(2);

      expect(Array.from(wrapper.state('indices'))).toEqual([2]);
    });

    it('uses first index if an array is passed', () => {
      instance.showItem([1, 2, 3]);

      expect(Array.from(wrapper.state('indices'))).toEqual([1]);
    });

    it('uses entire array if `multiple` is on', () => {
      wrapper.setProps({
        multiple: true,
      });
      instance.showItem([1, 2, 3]);

      expect(Array.from(wrapper.state('indices'))).toEqual([1, 2]);
    });
  });

  describe('toggleItem()', () => {
    it('replaces indices when nothing is on', () => {
      expect(Array.from(wrapper.state('indices'))).toEqual([0]);

      instance.toggleItem(1);

      expect(Array.from(wrapper.state('indices'))).toEqual([1]);

      instance.toggleItem(2);

      expect(Array.from(wrapper.state('indices'))).toEqual([2]);
    });

    it('toggles an index on and off when `multiple` is on', () => {
      wrapper.setProps({
        multiple: true,
      });

      expect(Array.from(wrapper.state('indices'))).toEqual([0]);

      instance.toggleItem(0);

      expect(Array.from(wrapper.state('indices'))).toEqual([]);

      instance.toggleItem(0);

      expect(Array.from(wrapper.state('indices'))).toEqual([0]);
    });

    it('toggles an index on and off when `multiple` is on', () => {
      wrapper.setProps({
        collapsible: true,
      });

      expect(Array.from(wrapper.state('indices'))).toEqual([0]);

      instance.toggleItem(0);

      expect(Array.from(wrapper.state('indices'))).toEqual([]);

      instance.toggleItem(0);

      expect(Array.from(wrapper.state('indices'))).toEqual([0]);
    });
  });
});
