/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Collapse from '../../motions/Collapse';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Section extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    children: PropTypes.node,
    expanded: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
  };

  render() {
    const { children, index, expanded } = this.props;

    return (
      <Collapse expanded={expanded}>
        <section
          role="tabpanel"
          id={this.formatID('accordion-section', index)}
          className={this.formatChildClass('section', {
            'is-expanded': expanded,
          })}
          aria-labelledby={this.formatID('accordion-header', index)}
          aria-hidden={!expanded}
          aria-expanded={expanded}
        >
          {children}
        </section>
      </Collapse>
    );
  }
}
