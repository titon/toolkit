/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Head extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['modal', 'head']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired
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
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
