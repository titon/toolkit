/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Divider extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['drop', 'divider']
    };

    static propTypes = {
        className: cssClass.isRequired
    };

    /**
     * Render the drop item divider.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li
                role="separator"
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)} />
        );
    }

}
