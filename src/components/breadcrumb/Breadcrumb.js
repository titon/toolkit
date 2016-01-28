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

export default class Breadcrumb extends Component {
    static defaultProps = {
        className: 'breadcrumb',
        label: 'Navigation'
    };

    static propTypes = {
        children: childrenOfType(Item),
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        label: PropTypes.string,
        size: PropTypes.oneOf(['small', 'large'])
    };

    /**
     * Generate a UID.
     */
    constructor() {
        super();

        this.generateUID();
    }

    /**
     * Render the breadcrumb list.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <nav
                id={this.formatID('breadcrumb')}
                className={this.formatClass(props.className, {
                    ['@' + props.size]: Boolean(props.size)
                })}
                role="navigation"
                aria-label={props.label}
                {...this.inheritNativeProps(props)}>

                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}
