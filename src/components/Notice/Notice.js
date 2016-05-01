/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import bind from '../../decorators/bind';
import { states } from '../propTypes';
import MODULE from './module';
import '../../polyfills/Array.includes';

export default class Notice extends Component {
    static module = MODULE;

    static defaultProps = {
        close: <span className="x" />,
        dismissable: false
    };

    static propTypes = {
        children: PropTypes.node,
        close: PropTypes.node,
        dismissable: PropTypes.bool,
        state: states,
        title: PropTypes.node
    };

    state = {
        dismissed: false
    };

    /**
     * Handler that dismisses the notice when the close button is clicked.
     */
    @bind
    handleOnClick() {
        this.setState({
            dismissed: true
        });
    }

    /**
     * Render the notice and or alert.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            role = ['warn', 'warning', 'error', 'danger', 'failure', 'critical']
                .includes(props.state) ? 'alert' : 'notice';

        // Remove the element entirely when dismissing
        if (this.state.dismissed) {
            return null;
        }

        return (
            <div
                role={role}
                className={this.formatClass({
                    ['@' + props.state]: props.state,
                    'is-dismissable': props.dismissable
                })}
                {...this.inheritNativeProps(props)}
            >
                {props.dismissable && (
                    <button
                        type="button" role="button"
                        className={this.formatChildClass('close')}
                        onClick={this.handleOnClick}
                    >
                        {props.close}
                    </button>
                )}

                {props.title && (
                    <div className={this.formatChildClass('head')}>
                        {props.title}
                    </div>
                )}

                <div className={this.formatChildClass('body')}>
                    {props.children}
                </div>
            </div>
        );
    }
}
