/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Form extends Component {
    static defaultProps = {
        elementClassName: 'form',
        method: 'get',
        multipart: false,
        inline: false
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        action: PropTypes.string.isRequired,
        method: PropTypes.oneOf(['get', 'post', 'put']),
        multipart: PropTypes.bool,
        inline: PropTypes.bool
    };

    /**
     * Render the form wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <form
                action={props.action}
                method={props.method}
                encType={props.multipart ? 'multipart/form-data' : 'application/x-www-form-urlencoded'}
                className={this.formatClass(props.elementClassName, props.className, {
                    '@inline': props.inline
                })}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </form>
        );
    }
}
