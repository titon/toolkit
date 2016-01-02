/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import childrenOfType from '../../../ext/prop-types/childrenOfType';

export default class Breadcrumb extends Component {
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
                    [props.size]: Boolean(props.size)
                })}
                role="navigation"
                aria-label={props.label}>
                <ol>
                    {props.children}
                </ol>
            </nav>
        );
    }
}

Breadcrumb.defaultProps = {
    className: 'breadcrumb',
    label: 'Breadcrumb Navigation'
};

Breadcrumb.propTypes = {
    children: childrenOfType(Item),
    className: PropTypes.string,
    label: PropTypes.string,
    size: PropTypes.oneOf(['small', 'large'])
};
