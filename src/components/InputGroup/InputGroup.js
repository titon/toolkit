/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import MODULE from './module';

export default class InputGroup extends Component {
    static module = MODULE;

    static propTypes = {
        children: PropTypes.node
    };

    /**
     * Render the input group wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <span
                className={this.formatClass()}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </span>
        );
    }
}
