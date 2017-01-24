/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import bind from '../../decorators/bind';
import debounce from '../../decorators/debounce';
import positionRelativeTo from '../../utility/positionRelativeTo';
import { positions } from '../../propTypes';
import MODULE from './module';

export default class Tooltip extends Component {
  static module = MODULE;

  static defaultProps = {
    position: 'top',
    type: 'tooltip',
    xOffset: 0,
    yOffset: 0,
  };

  static propTypes = {
    children: PropTypes.node,
    position: positions,
    // Is an HTML element, but element/node prop types don't work
    targetElement: PropTypes.element,
    title: PropTypes.node,
    type: PropTypes.oneOf(['tooltip', 'popover']),
    xOffset: PropTypes.number,
    yOffset: PropTypes.number,
  };

  state = {
    sourceElement: null,
  };

  componentWillMount() {
    window.addEventListener('resize', this.handleOnResize);
  }

  componentDidMount() {
    if (this.props.targetElement) {
      this.setState({
        sourceElement: ReactDOM.findDOMNode(this),
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleOnResize);
  }

  calculatePosition() {
    const { sourceElement } = this.state;
    const { targetElement, position, xOffset, yOffset } = this.props;

    if (sourceElement && targetElement) {
      return positionRelativeTo(position, sourceElement, targetElement, {
        left: xOffset,
        top: yOffset,
      });
    }

    return {};
  }

  @bind
  @debounce(150)
  handleOnResize() {
    this.forceUpdate();
  }

  render() {
    const { type, position, title, children } = this.props;

    return (
      <div
        role="tooltip"
        id={this.formatID(type)}
        className={this.formatClass(position)}
        style={this.calculatePosition()}
        aria-labelledby={title ? this.formatID(`${type}-title`) : null}
        aria-describedby={this.formatID(`${type}-content`)}
      >
        <div className={this.formatChildClass('inner')}>
          {title && (
            <div
              id={this.formatID(`${type}-title`)}
              className={this.formatChildClass('head')}
            >
              {title}
            </div>
          )}

          <div
            id={this.formatID(`${type}-content`)}
            className={this.formatChildClass('body')}
          >
            {children}
          </div>

          <div className={this.formatChildClass('arrow')} />
        </div>
      </div>
    );
  }
}
