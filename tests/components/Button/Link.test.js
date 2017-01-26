import React from 'react';
import { shallow } from 'enzyme';
import Link from '../../../src/components/Button/Link';

describe('components/Button/<Link/>', () => {
  it('renders an anchor link', () => {
    const wrapper = shallow(<Link href="/">Foo</Link>).shallow().shallow();

    expect(wrapper.type()).toBe('a');
    expect(wrapper.prop('href')).toBe('/');
    expect(wrapper.prop('className')).toBe('button');
    expect(wrapper.prop('children')).toBe('Foo');
  });

  it('errors if `href` is not defined', () => {
    shallow(<Link>Foo</Link>);

    expect(console.error).toHaveBeenCalled();
  });
});
