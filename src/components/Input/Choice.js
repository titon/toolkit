/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Choice extends Component {
    static defaultProps = {
        elementClassName: ['input', 'choice']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        inputID: PropTypes.string.isRequired,
        large: PropTypes.bool,
        small: PropTypes.bool
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
                className={this.formatClass(props.elementClassName, props.className, {
                    '@large': Boolean(props.large),
                    '@small': Boolean(props.small)
                })}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </label>
        );
    }
}
