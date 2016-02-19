/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Block from './Block';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';

export default class Region extends Component {
    static defaultProps = {
        className: 'region'
    };

    static propTypes = {
        children: children(Block),
        className: cssClass.isRequired,
        uniqueClassName: cssClass,
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
