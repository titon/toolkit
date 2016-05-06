/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import childrenOf from '../../prop-types/childrenOf';
import MODULE from './module';

export default class Steps extends Component {
    static module = MODULE;

    static defaultProps = {
        label: 'Stepped Navigation'
    };

    static propTypes = {
        children: childrenOf(Item),
        label: PropTypes.string
    };

    /**
     * Render the steps wrapper.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <nav
                role="navigation"
                className={this.formatClass()}
                aria-label={props.label}
                {...this.inheritNativeProps(props)}
            >
                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}
