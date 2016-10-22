/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import { TransitionMotion, spring, presets } from 'react-motion';
import Component from '../../Component';
import { motionSpring } from '../../propTypes';
import MODULE from './module';

export default class Group extends Component {
  static module = MODULE;

  static defaultProps = {
    motion: {
      stiffness: 120,
      damping: 14,
    },
    style: {},
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    motion: motionSpring,
    style: PropTypes.object,
  };

  constructor() {
    super();

    this.state = {
      styles: [],
    };

    this.handleWillEnter = this.handleWillEnter.bind(this);
    this.handleWillLeave = this.handleWillLeave.bind(this);
  }

  handleWillEnter() {
    return {
      opacity: spring(0),
      scale: spring(0.95),
    };
  }

  handleWillLeave() {
    return {
      opacity: spring(0),
      scale: spring(0.95),
    };
  }

  mapStylesFromChildren(children) {
    let styles = [],
      defaultStyles = [];

        // Inherit the original `key` as `Children.toArray()` changes it
    Children.toArray(children).map((child, i) => {
      styles.push({
        key: children[i].key,
        style: { opacity: spring(1), scale: spring(1) },
      });

      defaultStyles.push({
        key: children[i].key,
        style: { opacity: spring(0), scale: spring(0.95) },
      });
    });

    return {
      styles,
      defaultStyles,
    };
  }

  render() {
    let { children, style } = this.props;
    let { styles, defaultStyles } = this.mapStylesFromChildren(children);

    console.log(styles, defaultStyles);

    return (
      <TransitionMotion
        willEnter={this.handleWillEnter}
        willLeave={this.handleWillLeave}
                // defaultStyles={defaultStyles}
        styles={styles}
      >
        {(motionStyles) => {
          return (
            <div className={this.formatChildClass('group')}>
              {motionStyles.map((motionStyle, i) => {
                console.log('base', motionStyle.style.opacity);

                if (!children[i]) {
                  return null;
                }

                return React.cloneElement(children[i], {
                  key: motionStyle.key,
                  style: {
                    ...style,
                    ...motionStyle.style,
                  },
                });
              })}
            </div>
                    );
        }}
      </TransitionMotion>
        );
  }
}
