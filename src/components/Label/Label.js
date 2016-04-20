/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import { states } from '../PropTypes';

export default class Label extends Component {
    static defaultProps = {
        elementClassName: 'label'
    };

    static propTypes = {
        arrow: PropTypes.oneOf(['left', 'right']),
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        large: PropTypes.bool,
        ribbon: PropTypes.oneOf(['left', 'right']),
        small: PropTypes.bool,
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
                className={this.formatClass(props.elementClassName, props.className, {
                    ['@arrow-' + props.arrow]: Boolean(props.arrow),
                    ['@large']: props.large,
                    ['@small']: props.small,
                    ['@ribbon-' + props.ribbon]: Boolean(props.ribbon),
                    ['@' + props.state]: Boolean(props.state)
                })}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </span>
        );
    }
}
