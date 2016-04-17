/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import states from '../../prop-types/states';
import '../../polyfills/Array.includes';

export default class Notice extends Component {
    static defaultProps = {
        bodyClassName: ['notice', 'body'],
        close: <span className="x" />,
        closeClassName: ['notice', 'close'],
        elementClassName: 'notice',
        headClassName: ['notice', 'head']
    };

    static propTypes = {
        bodyClassName: cssClass.isRequired,
        children: PropTypes.node,
        className: cssClass,
        close: PropTypes.node,
        closeClassName: cssClass.isRequired,
        dismissable: PropTypes.bool,
        elementClassName: cssClass.isRequired,
        headClassName: cssClass.isRequired,
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
                className={this.formatClass(props.elementClassName, props.className, {
                    ['@' + props.state]: Boolean(props.state),
                    'is-dismissable': props.dismissable
                })}
                {...this.inheritNativeProps(props)}>

                {props.dismissable && (
                    <button
                        type="button" role="button"
                        className={this.formatClass(props.closeClassName)}
                        onClick={this.handleOnClick}>
                        {props.close}
                    </button>
                )}

                {props.title && (
                    <div className={this.formatClass(props.headClassName)}>
                        {props.title}
                    </div>
                )}

                <div className={this.formatClass(props.bodyClassName)}>
                    {props.children}
                </div>
            </div>
        );
    }
}
