/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { states } from '../propTypes';
import MODULE from './module';

export default class Bar extends Component {
    static module = MODULE;

    static propTypes = {
        children: PropTypes.node,
        percent: PropTypes.number.isRequired,
        state: states
    };

    /**
     * Render the progress bar segment.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatChildClass('bar', {
                    ['is-' + props.state]: props.state
                })}
                style={{ width: props.percent + '%' }}
                {...this.inheritNativeProps(props)}
            >
                {props.children || `${props.percent}%`}
            </div>
        );
    }
}
