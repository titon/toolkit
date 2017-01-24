/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import generateTabIndex from '../../utility/generateTabIndex';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Tab extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
    fragment: PropTypes.string,
    index: PropTypes.number.isRequired,
    onClick: collectionOf.func,
  };

  constructor(props, context) {
    super();

    this.state = {
      active: this.getContext(context).isSectionActive(props.index),
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      active: this.getContext(nextContext).isSectionActive(nextProps.index),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.active !== this.state.active);
  }

  @bind
  handleOnClick(e) {
    this.getContext().toggleSection(this.props.index);
    this.handleEvent('click', e);
  }

  render() {
    const { children, index } = this.props;
    const { active } = this.state;

    return (
      <li>
        <button
          type="button" role="tab"
          id={this.formatID('tabs-tab', index)}
          className={this.formatChildClass('tab', {
            'is-active': active,
          })}
          aria-controls={this.formatID('tabs-section', index)}
          aria-selected={active}
          aria-expanded={active}
          tabIndex={generateTabIndex(this)}
          onClick={this.handleOnClick}
        >
          {children}
        </button>
      </li>
    );
  }
}
