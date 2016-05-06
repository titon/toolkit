/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { default as BaseGate } from '../Gateway/Gate';
import Toast from './Toast';
import { positions } from '../../propTypes';
import MODULE from './module';

export default class Gate extends BaseGate {
    static module = MODULE;

    static defaultProps = {
        ...BaseGate.defaultProps,
        contract: Toast,
        position: 'bottom-left'
    };

    static propTypes = {
        ...BaseGate.propTypes,
        animation: PropTypes.oneOf([
            'fade', 'slide-up', 'slide-down', 'slide-left', 'slide-right'
        ]),
        position: positions
    };

    /**
     * Render the gateway and its children.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <aside
                role="log"
                className={this.formatChildClass('gate', props.animation, props.position)}
                aria-relevant="additions"
                aria-hidden="false"
                {...this.inheritNativeProps(props)}
            >
                {this.renderChildren(this.state.children)}
            </aside>
        );
    }
}
