/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Spacer extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['pagination', 'spacer']
    };

    static propTypes = {
        children: PropTypes.node,
        elementClassName: cssClass.isRequired
    };

    /**
     * Render the pagination item spacer.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <span className={this.formatClass(props.elementClassName)}>
                    {props.children}
                </span>
            </li>
        );
    }
}
