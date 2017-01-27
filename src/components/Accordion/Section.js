/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Collapse from '../../motions/Collapse';
import formatID from '../../utility/formatID';
import { classes } from '../../styler';
import { classStyles } from '../../propTypes';
import contextTypes from './contextTypes';

// Private
export default function ToolkitAccordionSection({
  children,
  classNames,
  expanded = false,
  index = 0,
}, {
  accordion,
}) {
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

ToolkitAccordionSection.contextTypes = {
  accordion: contextTypes.isRequired,
};

ToolkitAccordionSection.propTypes = {
  children: PropTypes.node,
  classNames: classStyles,
  expanded: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
};
