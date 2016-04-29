/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import Block from './Block';
import children from '../../prop-types/children';
import formatClass from '../../utility/formatClass';
import MODULE from './module';

export default function Region(props) {
    return (
        <div
            className={formatClass(MODULE.classNames.region, {
                '@grid': props.grid,
                '@wrap': props.wrap,
                ['@' + props.orientation]: props.orientation,
                ['flow-' + props.flow]: props.flow
            })}
            aria-orientation={props.orientation}
        >
            {props.children}
        </div>
    );
}

Region.module = MODULE;

Region.defaultProps = {
    grid: false,
    wrap: false
};

Region.propTypes = {
    children: children(Block),
    flow: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center', 'between', 'around']),
    grid: PropTypes.bool,
    orientation: PropTypes.oneOf(['horizontal', 'vertical']),
    wrap: PropTypes.bool
};
