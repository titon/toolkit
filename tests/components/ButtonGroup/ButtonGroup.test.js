import React from 'react';
import { shallow } from 'enzyme';
import Button from '../../../src/components/Button/Button';
import ButtonGroup from '../../../src/components/ButtonGroup/ButtonGroup';

describe('components/ButtonGroup/<ButtonGroup/>', () => {
  it('renders a button group', () => {
    const wrapper = shallow(<ButtonGroup><Button>Foo</Button></ButtonGroup>).dive();

    expect(wrapper.type()).toBe('ul');
    expect(wrapper.prop('role')).toBe('toolbar');
    expect(wrapper.prop('className')).toBe('button-group');
    expect(wrapper.prop('id')).toMatch(/^titon-button-group-/);
  });

  it('wraps each child in an `<li>`', () => {
    const wrapper = shallow(
      <ButtonGroup>
        <Button>Foo</Button>
        <Button>Bar</Button>
        <Button>Baz</Button>
      </ButtonGroup>,
    ).dive();

    expect(wrapper.childAt(0).type()).toBe('li');
    expect(wrapper.childAt(1).type()).toBe('li');
    expect(wrapper.childAt(2).type()).toBe('li');
  });

  it('supports ARIA', () => {
    const wrapper = shallow(<ButtonGroup><Button>Foo</Button></ButtonGroup>).dive();

    expect(wrapper.prop('aria-label')).toBe('Button Group');

    wrapper.setProps({
      label: 'Custom Label',
    });

    expect(wrapper.prop('aria-label')).toBe('Custom Label');
  });

  it('can render as `justified`', () => {
    const wrapper = shallow(<ButtonGroup justified><Button>Foo</Button></ButtonGroup>).dive();

    expect(wrapper.prop('className')).toBe('button-group button-group--justified');
  });

  it('can render as `vertical`', () => {
    const wrapper = shallow(<ButtonGroup vertical><Button>Foo</Button></ButtonGroup>).dive();

    expect(wrapper.prop('className')).toBe('button-group button-group--vertical');
  });
});
