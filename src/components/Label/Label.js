/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { defaultSizeProps, sizePropTypes, states } from '../propTypes';
import MODULE from './module';

export default class Label extends Component {
    static module = MODULE;

    static defaultProps = {
        ...defaultSizeProps
    };

    static propTypes = {
        ...sizePropTypes,
        arrow: PropTypes.oneOf(['left', 'right']),
        children: PropTypes.node,
        ribbon: PropTypes.oneOf(['left', 'right']),
        state: states
    };

    /**
     * Render the inline label.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <span
                className={this.formatClass({
                    ['@arrow-' + props.arrow]: props.arrow,
                    ['@large']: props.large,
                    ['@small']: props.small,
                    ['@ribbon-' + props.ribbon]: props.ribbon,
                    ['@' + props.state]: props.state
                })}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </span>
        );
    }
}
