/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import { Motion, spring } from 'react-motion';
import Component from '../../Component';
import { motionSpring } from '../../propTypes';
import MODULE from './module';

export default class Fade extends Component {
  static module = MODULE;

  static defaultProps = {
    motion: {
      stiffness: 210,
      damping: 20,
    },
    style: {},
    visible: true,
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    motion: motionSpring,
    onRest: PropTypes.func,
    style: PropTypes.object,
    visible: PropTypes.bool.isRequired,
  };

    /**
     * Render a wrapper that triggers fade animations.
     *
     * @returns {JSX}
     */
  render() {
    let { children, motion, onRest, style, visible } = this.props;

    return (
      <Motion
        defaultStyle={{ opacity: 0 }}
        style={{ opacity: spring(visible ? 1 : 0, motion) }}
        onRest={onRest}
      >
        {motionStyle => React.cloneElement(Children.only(children), {
          style: {
            ...motionStyle,
            ...style,
          },
        })}
      </Motion>
        );
  }
}
