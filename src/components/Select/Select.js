/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import { default as InputSelect } from '../Input/Select';
import Menu from './Menu';
import bind from '../../decorators/bind';
import childrenOf from '../../prop-types/childrenOf';
import formatInputName from '../../utility/formatInputName';
import invariant from '../../utility/invariant';
import isOutsideElement from '../../utility/isOutsideElement';
import generateUID from '../../utility/generateUID';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';
import { TOUCH } from '../../flags';

export default class Select extends InputSelect {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static defaultProps = {
    ...InputSelect.defaultProps,
    arrow: <span className="caret-down" />,
    countMessage: '{count} of {total} selected',
    defaultLabel: 'Select an Option',
    listLimit: 3,
    multipleFormat: 'list',
    native: TOUCH,
  };

  static propTypes = {
    ...InputSelect.propTypes,
    arrow: PropTypes.node,
    children: childrenOf(Menu),
    countMessage: PropTypes.string,
    defaultLabel: PropTypes.string,
    listLimit: PropTypes.number,
    multipleFormat: PropTypes.oneOf(['count', 'list']),
    native: PropTypes.bool,
  };

  uid = generateUID();

  constructor(props) {
    super(props);

    if (props.multiple) {
      invariant(!props.native && !TOUCH,
        'Selects using `multiple` cannot use `native` controls on non-touch devices.');
    }

    this.state = {
      ...this.state,
      expanded: false,
      options: this.extractOptions(props.options),
      value: this.extractValues(props.defaultValue, props.multiple),
    };
  }

  getChildContext() {
    const { name, options, multiple } = this.props;
    const { expanded, value } = this.state;

    return {
      [MODULE.contextKey]: {
        expanded,
        hideMenu: this.hideMenu,
        inputID: formatInputName(name),
        inputName: name,
        mappedOptions: this.state.options,
        multiple,
        options,
        selectValue: this.selectValue,
        selectedValues: this.extractValues(value, true),
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
    return this.hasMenu() ? true : super.shouldComponentUpdate(nextProps, nextState);
  }

  componentWillUpdate(nextProps, nextState) {
    if (nextState.value !== this.state.value) {
      super.componentWillUpdate(nextProps, nextState);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.value !== this.state.value) {
      super.componentDidUpdate(prevProps, prevState);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOnClickOut);
  }

  extractOptions(options) {
    const map = {};

    options.forEach((option) => {
      // Optgroup
      if (option.options) {
        option.options.forEach((child) => {
          map[child.value] = child;
        });

      // Option
      } else {
        map[option.value] = option;
      }
    });

    return map;
  }

  extractValues(value, multiple) {
    const values = Array.isArray(value) ? value : [value];

    if (!multiple) {
      return values[0] || '';
    }

    return values;
  }

  getSelectedLabel() {
    const { options } = this.state;
    const { listLimit, defaultLabel, multipleFormat, countMessage } = this.props;
    const label = [];
    let count = 0;
    let message = '';
    let { value } = this.state;

    if (!value.length) {
      return defaultLabel;
    }

    if (!Array.isArray(value)) {
      value = [value];
    }

    value.forEach((val) => {
      const option = options[val];

      if (option) {
        label.push(option.selectedLabel || option.label);
        count += 1;
      }
    });

    switch (multipleFormat) {
      case 'count':
        return countMessage
          .replace('{count}', count)
          .replace('{total}', Object.keys(options).length);

      default:
        message = label.slice(0, listLimit).join(', ');

        if (listLimit < count) {
          message += ' ...';
        }

        return message;
    }
  }

  hasMenu() {
    return (Children.count(this.props.children) > 0);
  }

  @bind
  hideMenu() {
    this.setState({
      expanded: false,
    });
  }

  @bind
  selectValue(value) {
    this.setState({
      value: this.extractValues(value, this.props.multiple),
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
    if (this.props.disabled || !this.hasMenu()) {
      return;
    }

    if (this.state.expanded) {
      this.hideMenu();
    } else {
      this.showMenu();
    }
  }

  @bind
  handleOnBlur() {
    if (!this.props.disabled && this.state.expanded && this.hasMenu()) {
      this.hideMenu();
    }
  }

  @bind
  handleOnClickLabel(e) {
    e.preventDefault();

    this.toggleMenu();
  }

  @bind
  handleOnClickOut(e) {
    if (
      !this.props.disabled && this.state.expanded &&
      this.hasMenu() && isOutsideElement(this.container, e.target)
    ) {
      this.hideMenu();
    }
  }

  @bind
  handleOnFocus() {
    if (!this.props.disabled && !this.state.expanded && this.hasMenu()) {
      this.showMenu();
    }
  }

  render() {
    const { children, native, disabled, options, arrow } = this.props;
    const { expanded } = this.state;
    const inputProps = this.gatherProps(false);
    const stateClasses = this.gatherStateClasses();

    // Add another state class
    stateClasses['is-native'] = native;

    return (
      <div
        ref={(ref) => { this.container = ref; }}
        id={this.formatID('select', inputProps.id)}
        className={this.formatClass(stateClasses)}
        aria-disabled={disabled}
      >
        <select
          {...inputProps}
          onFocus={this.handleOnFocus}
          onBlur={this.handleOnBlur}
        >
          {this.renderOptions(options)}
        </select>

        <a
          href=""
          role="button"
          className={this.formatChildClass('toggle', stateClasses)}
          onClick={this.handleOnClickLabel}
          aria-controls={native ? null : this.formatID('select-toggle', inputProps.id)}
          aria-haspopup={native ? null : true}
          aria-expanded={native ? null : expanded}
        >
          <span className={this.formatChildClass('label')}>
            {this.getSelectedLabel()}
          </span>

          <span className={this.formatChildClass('arrow')}>
            {arrow}
          </span>
        </a>

        {native ? null : children}
      </div>
    );
  }
}
