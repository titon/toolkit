/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Addon extends Component {
    static defaultProps = {
        elementClassName: ['input-group', 'addon']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        large: PropTypes.bool,
        small: PropTypes.bool
    };

    /**
     * Render the inline input group add-on.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <span
                className={this.formatClass(props.elementClassName, props.className, {
                    ['@large']: props.large,
                    ['@small']: props.small
                })}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </span>
        );
    }
}
