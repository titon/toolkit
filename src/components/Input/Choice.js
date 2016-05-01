/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { defaultSizeProps, sizePropTypes } from '../propTypes';
import MODULE from './module';

export default class Choice extends Component {
    static module = MODULE;

    static defaultProps = {
        ...defaultSizeProps
    };

    static propTypes = {
        ...sizePropTypes,
        children: PropTypes.node,
        inputID: PropTypes.string.isRequired
    };

    /**
     * Render either a checkbox or radio input wrapping label.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <label
                htmlFor={props.inputID}
                className={this.formatChildClass('choice', {
                    '@large': props.large,
                    '@small': props.small
                })}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </label>
        );
    }
}
