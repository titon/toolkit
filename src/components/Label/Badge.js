/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import states from '../../prop-types/states';

export default class Badge extends Component {
    static defaultProps = {
        elementClassName: 'label'
    };

    static propTypes = {
        children: PropTypes.string,
        className: cssClass,
        elementClassName: cssClass.isRequired,
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
                className={this.formatClass(props.elementClassName, props.className, {
                    '@badge': true,
                    ['@large']: props.large,
                    ['@small']: props.small,
                    ['@' + props.state]: Boolean(props.state)
                })}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </span>
        );
    }
}
