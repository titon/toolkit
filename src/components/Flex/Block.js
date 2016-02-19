/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import range from '../../prop-types/range';

export default class Block extends Component {
    static defaultProps = {
        className: 'block'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass.isRequired,
        uniqueClassName: cssClass,
        order: PropTypes.number,
        grow: PropTypes.number,
        shrink: PropTypes.number,
        self: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center', 'baseline', 'stretch']),
        span: range.span12,
        xsmall: range.span6,
        small: range.span12,
        medium: range.span12,
        large: range.span12,
        xlarge: range.span18
    };

    /**
     * Render the flex block.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            shrink = props.shrink,
            order = props.order,
            grow = props.grow,
            classes = {};

        ['self', 'span', 'xsmall', 'small', 'medium', 'large', 'xlarge'].forEach(size => {
            let span = props[size];

            if (span) {
                classes[size + '-' + span] = true;
            }
        });

        return (
            <div
                className={this.formatClass(props.className, classes)}
                style={{
                    order: (typeof order === 'number' && order >= 0) ? order : null,
                    flexGrow: (typeof grow === 'number' && grow >= 0) ? grow : null,
                    flexShrink: (typeof shrink === 'number' && shrink >= 0) ? shrink : null
                }}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
