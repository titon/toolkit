/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import childrenOfType from '../../prop-types/childrenOfType';
import cssClassName from '../../prop-types/cssClassName';

export default class Step extends Component {
    static defaultProps = {
        className: 'step',
        label: 'Stepped Navigation'
    };

    static propTypes = {
        children: childrenOfType(Item),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
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
                className={this.formatClass(props.className)}
                aria-label={props.label}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}
