/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Body extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['modal', 'body']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass.isRequired
    };

    /**
     * Render the modal inner body.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                id={this.formatID('modal-content')}
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
