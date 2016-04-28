/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint require-jsdoc: 0, react/sort-prop-types: 0, sorting/sort-object-props: 0 */

import React, { PropTypes } from 'react';
import formatClass from '../../utility/formatClass';
import range from '../../prop-types/range';

const SPAN_CLASSES = {
    span: 'span',
    push: 'push',
    pull: 'pull',
    xsmall: 'xs',
    xsmallPush: 'xs-push',
    xsmallPull: 'xs-pull',
    small: 'sm',
    smallPush: 'sm-push',
    smallPull: 'sm-pull',
    medium: 'md',
    mediumPush: 'md-push',
    mediumPull: 'md-pull',
    large: 'lg',
    largePush: 'lg-push',
    largePull: 'lg-pull',
    xlarge: 'xl',
    xlargePush: 'xl-push',
    xlargePull: 'xl-pull'
};

export default function Col(props) {
    let classes = {};

    Object.keys(SPAN_CLASSES).forEach(key => {
        let span = props[key];

        if (span) {
            classes[SPAN_CLASSES[key] + '-' + span] = true;
        }
    });

    // End needs to be last to override any styles
    if (props.end) {
        classes.end = true;
    }

    return (
        <div className={formatClass(props.className, classes)}>
            {props.children}
        </div>
    );
}

Col.defaultProps = {
    className: 'col'
};

Col.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string.isRequired,

    // This is ugly, a better way?
    span: range.span12,
    push: range.span12,
    pull: range.span12,
    xsmall: range.span6,
    xsmallPush: range.span6,
    xsmallPull: range.span6,
    small: range.span12,
    smallPush: range.span12,
    smallPull: range.span12,
    medium: range.span12,
    mediumPush: range.span12,
    mediumPull: range.span12,
    large: range.span12,
    largePush: range.span12,
    largePull: range.span12,
    xlarge: range.span18,
    xlargePush: range.span18,
    xlargePull: range.span18,
    end: PropTypes.bool
};
