import React from 'react';
import { mount, shallow } from 'enzyme';
import Collapse from '../../../src/motions/Collapse/Collapse';

describe('motions/Collapse/<Collapse/>', () => {
  it('wraps the content with an auto sized element', () => {
    const wrapper = shallow(
      <Collapse direction="width">
        <div style={{ height: 250 }}>Child</div>
      </Collapse>,
    );

    expect(wrapper.prop('style')).toEqual({ width: 'auto' });
  });

  it('calculates element height on mount', () => {
    const wrapper = mount(
      <Collapse>
        <div style={{ height: 250 }}>Child</div>
      </Collapse>,
    );

    setTimeout(() => {
      expect(wrapper.state('size')).toBe(250);
    }, 0);
  });

  it('calculates element width on mount', () => {
    const wrapper = mount(
      <Collapse direction="width">
        <div style={{ width: 250 }}>Child</div>
      </Collapse>,
    );

    setTimeout(() => {
      expect(wrapper.state('size')).toBe(250);
    }, 0);
  });

  it('can fix the size using `fixedAt`', () => {
    const wrapper = mount(
      <Collapse fixedAt={300}>
        <div style={{ height: 250 }}>Child</div>
      </Collapse>,
    );

    setTimeout(() => {
      expect(wrapper.state('size')).toBe(300);
    }, 0);
  });
});
