/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import debounce from 'lodash.debounce';
import { motionSpringPropType, stylePropType } from '../../propTypes';

export default class Collapse extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    direction: PropTypes.oneOf(['width', 'height']),
    expanded: PropTypes.bool,
    fixedAt: PropTypes.number,
    motion: motionSpringPropType,
    onRest: PropTypes.func,
    style: stylePropType,
  };

  static defaultProps = {
    direction: 'height',
    expanded: true,
    motion: {
      stiffness: 210,
      damping: 20,
    },
    style: {},
  };

  state = {
    size: 0,
    calculate: true,
    changed: false,
  };

  componentWillMount() {
    window.addEventListener('resize', this.handleResize);
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
    window.removeEventListener('resize', this.handleResize);
  }

  calculateSize() {
    if (this.state.calculate) {
      this.setState({
        size: this.element.getBoundingClientRect()[this.props.direction],
        calculate: false,
      });
    }
  }

  handleResize = debounce(() => {
    this.setState({
      calculate: true,
    });
  }, 100);

  getMotionSize() {
    const { size, changed } = this.state;
    const { expanded, fixedAt, motion } = this.props;
    const expandedSize = expanded ? (fixedAt || size) : 0;

    return changed ? spring(expandedSize, motion) : expandedSize;
  }

  render() {
    const { calculate } = this.state;
    const { children, direction, style, onRest } = this.props;
    const content = (
      <div ref={(ref) => { this.element = ref; }}>
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
