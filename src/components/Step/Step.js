/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import children from '../../prop-types/children';
import cssClass from '../../prop-types/cssClass';

export default class Step extends Component {
    static defaultProps = {
        elementClassName: 'step',
        label: 'Stepped Navigation'
    };

    static propTypes = {
        children: children(Item),
        className: cssClass,
        elementClassName: cssClass.isRequired,
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
                className={this.formatClass(props.elementClassName, props.className)}
                aria-label={props.label}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}
