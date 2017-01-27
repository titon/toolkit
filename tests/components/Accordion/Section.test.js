import React from 'react';
import { shallow } from 'enzyme';
import Section from '../../../src/components/Accordion/Section';

describe('components/Accordion/<Section/>', () => {
  const context = {
    accordion: { uid: 'foo' },
  };

  const classNames = {
    section: 'accordion__section',
    section__expanded: 'is-expanded',
  };

  it('renders a section', () => {
    const wrapper = shallow(
      <Section classNames={classNames} index={0} expanded={false}>
        Child
      </Section>
    , { context });
    const section = wrapper.find('section');

    expect(wrapper.prop('expanded')).toBe(false);
    expect(section.prop('role')).toBe('tabpanel');
    expect(section.prop('id')).toBe('titon-accordion-section-foo-0');
    expect(section.prop('className')).toBe('accordion__section');
    expect(section.prop('children')).toBe('Child');
  });

  it('sets expanded class', () => {
    const wrapper = shallow(
      <Section classNames={classNames} index={0} expanded>
        Child
      </Section>
    , { context });

    expect(wrapper.prop('expanded')).toBe(true);
    expect(wrapper.find('section').prop('className')).toBe('accordion__section is-expanded');
  });

  it('supports ARIA', () => {
    const wrapper = shallow(
      <Section classNames={classNames} index={0} expanded>
        Child
      </Section>
    , { context });
    let section = wrapper.find('section');

    expect(section.prop('aria-labelledby')).toBe('titon-accordion-header-foo-0');
    expect(section.prop('aria-hidden')).toBe(false);
    expect(section.prop('aria-expanded')).toBe(true);

    wrapper.setProps({
      expanded: false,
    });

    section = wrapper.find('section');

    expect(section.prop('aria-hidden')).toBe(true);
    expect(section.prop('aria-expanded')).toBe(false);
  });
});
