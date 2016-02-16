/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Block from './Block';
import childrenOfType from '../../prop-types/childrenOfType';
import cssClassName from '../../prop-types/cssClassName';

export default class Region extends Component {
    static defaultProps = {
        className: 'region'
    };

    static propTypes = {
        children: childrenOfType(Block),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        wrap: PropTypes.bool,
        grid: PropTypes.bool,
        flow: PropTypes.oneOf(['top', 'left', 'bottom', 'right', 'center', 'between', 'around']),
        orientation: PropTypes.oneOf(['horizontal', 'vertical'])
    };

    /**
     * Render the flex region.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatClass(props.className, {
                    '@wrap': props.wrap,
                    '@grid': props.grid,
                    ['@' + props.orientation]: Boolean(props.orientation),
                    ['flow-' + props.flow]: Boolean(props.flow)
                })}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
