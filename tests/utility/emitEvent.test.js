import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import Titon from '../../src/Titon';
import emitEvent from '../../src/utility/emitEvent';

class EventStub extends React.Component {
  static contextTypes = {
    inherit: PropTypes.object,
  };

  emit(eventName, ...args) {
    // We must trigger this within a component so that we have access to "this"
    emitEvent(this, 'inherit', eventName, ...args);
  }

  render() {
    return <div />;
  }
}

describe('emitEvent()', () => {
  const oldInfo = console.info;
  const oldDir = console.dir;

  beforeEach(() => {
    console.info = jest.fn();
    console.dir = jest.fn();
  });

  afterEach(() => {
    console.info = oldInfo;
    console.dir = oldDir;
  });

  it('triggers prop if it exists', () => {
    const spy1 = jest.fn();
    const wrapper = shallow(<EventStub onFoo={spy1} />);

    wrapper.instance().emit('onFoo', 1, 2, 3);

    expect(spy1).toBeCalledWith(1, 2, 3);
  });

  it('doesnt trigger prop if it doesnt exist', () => {
    const spy1 = jest.fn();
    const wrapper = shallow(<EventStub onFoo={spy1} />);

    wrapper.instance().emit('onBar', 1, 2, 3);

    expect(spy1).not.toBeCalled();
  });

  it('logs to console if in debug mode', () => {
    const wrapper = shallow(<EventStub onFoo={() => {}} debug />);

    wrapper.instance().emit('onFoo', 1, 2, 3);

    expect(console.info).toBeCalledWith('EventStub', expect.anything(), 'onFoo', [1, 2, 3]);
  });

  it('logs extra info if debug is verbose', () => {
    const wrapper = shallow(<EventStub onFoo={() => {}} debug />);

    wrapper.instance().emit('onFoo', 1, 2, 3);

    expect(console.dir).not.toBeCalled();

    wrapper.setProps({
      debug: 'verbose',
    });

    wrapper.instance().emit('onFoo', 1, 2, 3);

    expect(console.dir).toBeCalled();
  });

  it('doesnt log to console if not in debug mode', () => {
    const wrapper = shallow(<EventStub onFoo={() => {}} />);

    wrapper.instance().emit('onFoo', 1, 2, 3);

    expect(console.info).not.toBeCalled();
  });

  it('can enable debug mode with the Titon instance', () => {
    Titon.options.debug = true;

    const wrapper = shallow(<EventStub onFoo={() => {}} />);

    wrapper.instance().emit('onFoo');

    expect(console.info).toBeCalledWith('EventStub', expect.anything(), 'onFoo', []);

    Titon.options.debug = false;
  });

  it('appends UID from class instance', () => {
    const wrapper = shallow(<EventStub onFoo={() => {}} debug />);

    wrapper.instance().uid = 'foo';
    wrapper.instance().emit('onFoo');

    expect(console.info).toBeCalledWith('EventStub#foo', expect.anything(), 'onFoo', []);
  });

  it('appends UID from context', () => {
    const wrapper = shallow(<EventStub onFoo={() => {}} debug />, {
      context: {
        inherit: { uid: 'bar' },
      },
    });

    wrapper.instance().emit('onFoo');

    expect(console.info).toBeCalledWith('EventStub#bar', expect.anything(), 'onFoo', []);
  });
});
