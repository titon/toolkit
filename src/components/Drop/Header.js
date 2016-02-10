/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Header extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['drop', 'header']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired
    };

    /**
     * Render the drop item header.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <li
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </li>
        );
    }

}
