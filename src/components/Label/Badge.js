/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { states } from '../PropTypes';
import MODULE from './module';

export default class Badge extends Component {
    static module = MODULE;

    static defaultProps = {
        large: false,
        small: false
    };

    static propTypes = {
        children: PropTypes.string,
        large: PropTypes.bool,
        small: PropTypes.bool,
        state: states
    };

    /**
     * Render the inline badge.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <span
                className={this.formatClass({
                    '@badge': true,
                    ['@large']: props.large,
                    ['@small']: props.small,
                    ['@' + props.state]: props.state
                })}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </span>
        );
    }
}
