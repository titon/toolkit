/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../Component';
import CONTEXT_TYPES from './ContextTypes2';
import MODULE from './module';

export default class MainContent extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    /**
     * Render the off canvas main content.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <main
                role="main"
                className={this.formatChildClass('content')}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </main>
        );
    }
}
