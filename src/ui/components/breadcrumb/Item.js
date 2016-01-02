/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';

export default class Item extends Component {
    /**
     * Render the breadcrumb item link.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <a href={props.url} onClick={props.onClick}>
                    {props.children}
                    <span className="caret">{props.caret}</span>
                </a>
            </li>
        );
    }
}

Item.defaultProps = {
    caret: '/',
    onClick: null
};

Item.propTypes = {
    children: PropTypes.node.isRequired,
    url: PropTypes.string.isRequired,
    caret: PropTypes.node,
    onClick: PropTypes.func
};
