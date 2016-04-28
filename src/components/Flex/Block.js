/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint sorting/sort-object-props: 0, require-jsdoc: 0 */

import React, { PropTypes } from 'react';
import formatClass from '../../utility/formatClass';
import range from '../../prop-types/range';

const SPAN_CLASSES = {
    self: 'self',
    span: 'span',
    xsmall: 'xs',
    small: 'sm',
    medium: 'md',
    large: 'lg',
    xlarge: 'xl'
};

export default function Block({ shrink, order, grow, ...props }) {
    let classes = {};

    Object.keys(SPAN_CLASSES).forEach(key => {
        let span = props[key];

        if (span) {
            classes[SPAN_CLASSES[key] + '-' + span] = true;
        }
    });

    return (
        <div
            className={formatClass(props.className, classes)}
            style={{
                flexGrow: (typeof grow === 'number' && grow >= 0) ? grow : null,
                flexShrink: (typeof shrink === 'number' && shrink >= 0) ? shrink : null,
                order: (typeof order === 'number' && order >= 0) ? order : null
            }}>

            {props.children}
        </div>
    );
}

Block.defaultProps = {
    className: 'block'
};

Block.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string.isRequired,
    grow: PropTypes.number,
    large: range.span12,
    medium: range.span12,
    order: PropTypes.number,
    self: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center', 'baseline', 'stretch']),
    shrink: PropTypes.number,
    small: range.span12,
    span: range.span12,
    xlarge: range.span18,
    xsmall: range.span6
};
