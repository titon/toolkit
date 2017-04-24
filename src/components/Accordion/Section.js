/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import React from 'react';
import PropTypes from 'prop-types';
import Collapse from '../../motions/Collapse';
import formatID from '../../utility/formatID';
import { classes } from '../../styler';
import { classNamesPropType } from '../../propTypes';
import contextTypes from './contextTypes';

import type { AccordionContext, AccordionSectionProps } from './types';

// Private
export default class ToolkitAccordionSection extends React.PureComponent {
  context: AccordionContext;
  props: AccordionSectionProps;

  static contextTypes = {
    accordion: contextTypes.isRequired,
  };

  static propTypes = {
    children: PropTypes.node.isRequired,
    classNames: classNamesPropType.isRequired,
    expanded: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
  };

  render() {
    const { children, classNames, expanded, index } = this.props;
    const { accordion } = this.context;

    return (
      <Collapse expanded={expanded}>
        <section
          role="tabpanel"
          id={formatID('accordion-section', accordion.uid, index)}
          className={classes(classNames.section, expanded && classNames.section__expanded)}
          aria-labelledby={formatID('accordion-header', accordion.uid, index)}
          aria-hidden={!expanded}
          aria-expanded={expanded}
        >
          {children}
        </section>
      </Collapse>
    );
  }
}
