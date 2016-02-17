/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Head extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['modal', 'head']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired
    };

    /**
     * Render the modal inner head.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                id={this.formatID('modal-title')}
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
