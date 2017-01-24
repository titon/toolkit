/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../Component';
import Tooltip from './Tooltip';
import bind from '../../decorators/bind';
import invariant from '../../utility/invariant';
import MODULE from './module';
import GATEWAY_CONTEXT_TYPES from '../Gateway/contextTypes';
import { contextKey } from '../Gateway/module';

export default class Warp extends Component {
  static module = MODULE;

  static contextTypes = GATEWAY_CONTEXT_TYPES;

  static defaultProps = {
    mode: 'hover',
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    gateName: PropTypes.string.isRequired,
    mode: PropTypes.oneOf(['click', 'hover']),
    tooltip: PropTypes.oneOfType([PropTypes.element, PropTypes.node]).isRequired,
  };

  state = {
    element: null,
    visible: false,
  };

  constructor(props, context) {
    super();

    invariant(typeof context[contextKey] !== 'undefined',
      'A `Tooltip.Warp` must be instantiated within a `Gateway`.');
  }

  @bind
  hideTooltip() {
    this.getContext(null, contextKey).warpOut(this.props.gateName, this.state.element);

    this.setState({
      element: null,
      visible: false,
    });
  }

  @bind
  showTooltip() {
    const { tooltip } = this.props;
    const targetElement = ReactDOM.findDOMNode(this);
    let element = null;

    // Already an element
    if (React.isValidElement(tooltip)) {
      element = React.cloneElement(tooltip, { targetElement });

    // Create an element
    } else {
      element = (
        <Tooltip key={this.uid} targetElement={targetElement}>
          {tooltip}
        </Tooltip>
      );
    }

    this.getContext(null, contextKey).warpIn(this.props.gateName, element);

    this.setState({
      element,
      visible: true,
    });
  }

  @bind
  toggleTooltip() {
    if (this.state.visible) {
      this.hideTooltip();
    } else {
      this.showTooltip();
    }
  }

  render() {
    const { children, mode } = this.props;
    const props = {
      className: this.state.visible ? 'is-active' : '',
    };

    if (mode === 'hover') {
      props.onMouseOver = this.showTooltip;
      props.onMouseOut = this.hideTooltip;
    } else {
      props.onClick = this.toggleTooltip;
    }

    return this.transferToChild(children, props);
  }
}
