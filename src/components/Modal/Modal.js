/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import DocumentState from '../../machines/DocumentState';
import Component from '../../Component';
import Body from './Body';
import Head from './Head';
import Foot from './Foot';
import bind from '../../decorators/bind';
import childrenOf from '../../prop-types/childrenOf';
import invariant from '../../utility/invariant';
import MODULE from './module';
import GATEWAY_CONTEXT_TYPES from '../Gateway/contextTypes';
import { contextKey } from '../Gateway/module';

export default class Modal extends Component {
  static module = MODULE;

  static contextTypes = GATEWAY_CONTEXT_TYPES;

  static defaultProps = {
    blackOut: true,
    close: <span className="x" />,
    dismissable: true,
    fullScreen: false,
    stopScroll: true,
  };

  static propTypes = {
    blackOut: PropTypes.bool,
    children: childrenOf(Body, Head, Foot),
    close: PropTypes.node,
    dismissable: PropTypes.bool,
    fullScreen: PropTypes.bool,
    gateName: PropTypes.string.isRequired,
    stopScroll: PropTypes.bool,
  };

  state = {
    expanded: false,
  };

  constructor(props, context) {
    super();

    invariant(typeof context[contextKey] !== 'undefined',
            'A `Modal` must be instantiated within a `Gateway`.');
  }

  componentWillMount() {
    const { dismissable, blackOut, stopScroll } = this.props;

    if (dismissable) {
      window.addEventListener('keyup', this.handleOnKeyUp);
    }

    if (blackOut) {
      DocumentState.showBlackout();
    }

    if (stopScroll) {
      DocumentState.disableScrolling();
    }
  }

  componentDidMount() {
    this.setState({
      expanded: true,
    });
  }

  componentWillUnmount() {
    const { dismissable, blackOut, stopScroll } = this.props;

    if (dismissable) {
      window.removeEventListener('keyup', this.handleOnKeyUp);
    }

    if (blackOut) {
      DocumentState.hideBlackout();
    }

    if (stopScroll) {
      DocumentState.enableScrolling();
    }
  }

  @bind
  hideModal() {
    this.getContext(null, contextKey).warpOut(this.props.gateName, this.getInternalElement());
  }

  @bind
  handleOnClick() {
    this.hideModal();
  }

  @bind
  handleOnClickOut({ target, currentTarget }) {
    if (target === currentTarget) {
      this.hideModal();
    }
  }

  @bind
  handleOnKeyUp({ key }) {
    if (key === 'Escape') {
      this.hideModal();
    }
  }

  render() {
    const { children, dismissable, fullScreen, close } = this.props;
    const { expanded } = this.state;

    return (
      <div
        role="dialog"
        id={this.formatID('modal')}
        className={this.formatClass({
          'is-dismissable': dismissable,
          'is-expanded': expanded,
          'is-fullscreen': fullScreen,
        })}
        aria-labelledby={this.formatID('modal-title')}
        aria-describedby={this.formatID('modal-content')}
        aria-hidden={!expanded}
        aria-expanded={expanded}
        onClick={dismissable ? this.handleOnClickOut : null}
      >
        <div className={this.formatChildClass('outer')}>
          <div className={this.formatChildClass('inner')}>
            {children}
          </div>

          {dismissable && (
            <button
              type="button"
              role="button"
              className={this.formatChildClass('close')}
              onClick={this.handleOnClick}
            >
              {close}
            </button>
          )}
        </div>
      </div>
    );
  }
}
