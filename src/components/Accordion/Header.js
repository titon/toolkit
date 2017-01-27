/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import formatID from '../../utility/formatID';
import { classes } from '../../styler';
import { classStyles } from '../../propTypes';
import contextTypes from './contextTypes';

// Private
export default class ToolkitAccordionHeader extends React.PureComponent {
  static contextTypes = {
    accordion: contextTypes.isRequired,
  };

  static propTypes = {
    active: PropTypes.bool.isRequired,
    children: PropTypes.node,
    classNames: classStyles,
    index: PropTypes.number.isRequired,
    onClick: PropTypes.func,
  };

  static defaultProps = {
    onClick() {},
  };

  handleClick = (e) => {
    e.preventDefault();

    this.context.accordion.toggleItem(this.props.index);
    this.props.onClick(e);
  };

  render() {
    const { children, classNames, index, active } = this.props;
    const { accordion } = this.context;

    return (
      <header
        role="tab"
        id={formatID('accordion-header', accordion.uid, index)}
        className={classes(classNames.header, active && classNames.header__active)}
        aria-controls={formatID('accordion-section', index)}
        aria-selected={active}
        aria-expanded={active}
      >
        <a href="" className={classNames.header_link} onClick={this.handleClick}>
          {children}
        </a>
      </header>
    );
  }
}
