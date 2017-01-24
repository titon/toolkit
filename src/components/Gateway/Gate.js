/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import invariant from '../../utility/invariant';
import generateUID from '../../utility/generateUID';
import emitEvent from '../../utility/emitEvent';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

import Fade from '../../motions/Fade';

export default class Gate extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static defaultProps = {
    motion: 'fade',
  };

  static propTypes = {
    contract: PropTypes.func.isRequired,
    motion: PropTypes.string,
    name: PropTypes.string.isRequired,
    onEntered: collectionOf.func,
    onEntering: collectionOf.func,
    onLeaving: collectionOf.func,
    onLeft: collectionOf.func,
  };

  state = {
    children: [],
    enteringElement: null,
    leavingElement: null,
  };

  uid = generateUID();

  constructor(props, context) {
    super();

    // The `contextKey` can be overwritten by child components
    // So force it to the gateways context key
    context[MODULE.contextKey].registerGate(props.name, this.handleOnWarpIn, this.handleOnWarpOut);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.enteringElement) {
      emitEvent(this, 'onEntering', nextState.enteringElement);
    }

    if (nextState.leavingElement) {
      emitEvent(this, 'onLeaving', nextState.leavingElement);
    }
  }

  componentDidUpdate() {
    const { enteringElement, leavingElement } = this.state;

    if (enteringElement) {
      emitEvent(this, 'onEntered', enteringElement);
    }

    if (leavingElement) {
      emitEvent(this, 'onLeft', leavingElement);
    }
  }

  @bind
  handleOnWarpIn(element) {
    const { children } = this.state;

    if (this.isValidElement(element) && !this.hasElement(element)) {
      this.setState({
        children: [...children, { key: element.key, element }],
        enteringElement: element,
        leavingElement: null,
      });
    }
  }

  @bind
  handleOnWarpOut(element) {
    const { children } = this.state;

    if (this.isValidElement(element) && this.hasElement(element)) {
      this.setState({
        children: children.filter(child => child.key !== element.key),
        enteringElement: null,
        leavingElement: element,
      });
    }
  }

  hasElement(element) {
    return !!this.state.children.find(child => child.key === element.key);
  }

  isValidElement(element) {
    const { contract, name } = this.props;

    invariant(React.isValidElement(element) && element.type === contract,
      'Value passed to "%s" `Gate` must be an instance of the `%s` component.',
      name, contract.name);

    return true;
  }

  renderChildren(children) {
    return (
      <Fade.Group>
        {children.map(child => child.element)}
      </Fade.Group>
    );
  }

  render() {
    return (
      <div className={this.formatChildClass('gate')}>
        {this.renderChildren(this.state.children)}
      </div>
    );
  }
}
