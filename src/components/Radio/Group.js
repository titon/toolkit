/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import formatInputName from '../../utility/formatInputName';
import generateUID from '../../utility/generateUID';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Group extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static defaultProps = {
    defaultChecked: '',
  };

  static propTypes = {
    children: PropTypes.node,
    defaultChecked: PropTypes.string,
    name: PropTypes.string.isRequired,
  };

  uid = generateUID();

  constructor(props) {
    super();

    this.state = {
      value: props.defaultChecked,
    };
  }

  getChildContext() {
    const { name } = this.props;

    return {
      [MODULE.contextKey]: {
        checkedValue: this.state.value,
        inputID: formatInputName(name),
        inputName: name,
        selectValue: this.selectValue,
        uid: this.uid,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.value !== this.state.value);
  }

  @bind
  selectValue(value) {
    this.setState({
      value,
    });
  }

  render() {
    return (
      <div
        id={this.formatID('radio-group')}
        className={this.formatChildClass('group')}
      >
        {this.props.children}
      </div>
    );
  }
}
