/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Component from '../../Component';
import debounce from 'lodash.debounce';
import { motionSpring } from '../../propTypes';
import MODULE from './module';

export default class Collapse extends Component {
  static module = MODULE;

  static defaultProps = {
    direction: 'height',
    expanded: true,
    motion: {
      stiffness: 210,
      damping: 20,
    },
    style: {},
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    direction: PropTypes.oneOf(['width', 'height']),
    expanded: PropTypes.bool.isRequired,
    fixedAt: PropTypes.number,
    motion: motionSpring,
    onRest: PropTypes.func,
    style: PropTypes.object,
  };

  constructor() {
    super();

    this.state = {
      size: 0,
      calculate: true,
      changed: false,
    };

    this.handleOnResize = debounce(this.handleOnResize.bind(this), 100);
  }

  componentWillMount() {
    window.addEventListener('resize', this.handleOnResize);
  }

  componentDidMount() {
    this.calculateSize();
  }

  componentWillReceiveProps({ expanded }) {
    this.setState({
      changed: (expanded !== this.props.expanded),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
            nextState.calculate !== this.state.calculate ||
            nextState.size !== this.state.size ||
            nextProps.expanded !== this.props.expanded
    );
  }

  componentDidUpdate() {
    this.calculateSize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleOnResize);
  }

  calculateSize() {
    if (this.state.calculate) {
      this.setState({
        size: this.element.getBoundingClientRect()[this.props.direction],
        calculate: false,
      });
    }
  }

  handleOnResize() {
    this.setState({
      calculate: true,
    });
  }

  getMotionSize() {
    let { size, changed } = this.state,
      { expanded, fixedAt, motion } = this.props,
      expandedSize = expanded ? (fixedAt || size) : 0;

    return changed ? spring(expandedSize, motion) : expandedSize;
  }

  render() {
    let { calculate } = this.state,
      { children, direction, expanded, style, onRest, ...props } = this.props;

    const content = (
      <div
        ref={(ref) => { this.element = ref; }}
        className={this.formatClass({
          [`@${direction}`]: true,
          'is-expanded': expanded,
        })}
      >
        {children}
      </div>
    );

    if (calculate) {
      return (
        <div style={{ [direction]: 'auto' }}>
          {content}
        </div>
      );
    }

    return (
      <Motion
        defaultStyle={{ [direction]: 0 }}
        style={{ [direction]: this.getMotionSize() }}
        onRest={onRest}
      >
        {motionStyle => React.cloneElement(content, {
          style: {
            ...style,
            ...motionStyle,
            overflow: 'hidden',
          },
        })}
      </Motion>
    );
  }
}
