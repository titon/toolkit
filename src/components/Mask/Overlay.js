/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import emitEvent from '../../utility/emitEvent';
import { showHidePropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Overlay extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static defaultProps = {
    collapsible: false,
  };

  static propTypes = {
    ...showHidePropTypes,
    children: PropTypes.node,
    collapsible: PropTypes.bool,
  };

  state = {
    expanded: false,
  };

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).expanded,
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  componentWillUpdate() {
    emitEvent(this, this.state.expanded ? 'onHiding' : 'onShowing');
  }

  componentDidUpdate() {
    emitEvent(this, this.state.expanded ? 'onShown' : 'onHidden');
  }

  @bind
  handleOnClick(e) {
    e.preventDefault();

    if (this.props.collapsible) {
      this.getContext().hideOverlay();
    }
  }

  render() {
    const { children, collapsible } = this.props;
    const { expanded } = this.state;

    return (
      <div
        role="presentation"
        id={this.formatID('mask-overlay')}
        className={this.formatChildClass('overlay', {
          'is-collapsible': collapsible,
          'is-expanded': expanded,
        })}
        onClick={this.handleOnClick}
        aria-hidden={!expanded}
      >
        {children}
      </div>
    );
  }

}
