/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import Menu from './Menu';
import Toggle from './Toggle';
import bind from '../../decorators/bind';
import childrenOf from '../../prop-types/childrenOf';
import isOutsideElement from '../../utility/isOutsideElement';
import generateUID from '../../utility/generateUID';
import emitEvent from '../../utility/emitEvent';
import { showHidePropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Drop extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static propTypes = {
    ...showHidePropTypes,
    children: childrenOf(Menu, Toggle),
  };

  state = {
    expanded: false,
  };

  uid = generateUID();

  getChildContext() {
    return {
      [MODULE.contextKey]: {
        expanded: this.state.expanded,
        hideMenu: this.hideMenu,
        showMenu: this.showMenu,
        toggleMenu: this.toggleMenu,
        uid: this.uid,
      },
    };
  }

  componentWillMount() {
    window.addEventListener('click', this.handleOnClickOut);
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

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOnClickOut);
  }

  @bind
  handleOnClickOut(e) {
    if (this.state.expanded && isOutsideElement(this.container, e.target)) {
      this.hideMenu();
    }
  }

  @bind
  hideMenu() {
    this.setState({
      expanded: false,
    });
  }

  @bind
  showMenu() {
    this.setState({
      expanded: true,
    });
  }

  @bind
  toggleMenu() {
    if (this.state.expanded) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  render() {
    return (
      <div id={this.formatID('drop')} ref={(ref) => { this.container = ref; }}>
        {this.props.children}
      </div>
    );
  }
}
