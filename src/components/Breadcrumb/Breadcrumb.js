/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import children from '../../prop-types/children';
import MODULE from './module';

export default class Breadcrumb extends Component {
    static module = MODULE;

    static defaultProps = {
        label: 'Navigation'
    };

    static propTypes = {
        children: children(Item),
        label: PropTypes.string
    };

    /**
     * Render the breadcrumb list.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <nav
                role="navigation"
                id={this.formatID('breadcrumb')}
                className={this.formatClass()}
                aria-label={props.label}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}
