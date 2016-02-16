/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';
import inNumberRange from '../../prop-types/inNumberRange';

const span6 = inNumberRange(1, 6);
const span12 = inNumberRange(1, 12);
const span18 = inNumberRange(1, 18);

export default class Block extends Component {
    static defaultProps = {
        className: 'block'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        order: PropTypes.number,
        grow: PropTypes.number,
        shrink: PropTypes.number,
        self: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center', 'baseline', 'stretch']),
        span: span12,
        xsmall: span6,
        small: span12,
        medium: span12,
        large: span12,
        xlarge: span18
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
