/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import autoBind from '../../decorators/autoBind';
import collectionOf from '../../prop-types/collectionOf';
import cssClassName from '../../prop-types/cssClassName';

export default class Item extends Component {

    /**
     * Handle the click event.
     *
     * @param {SyntheticEvent} e
     */
    @autoBind
    handleOnClick(e) {
        this.handleEvent('click', e);
    }

    /**
     * Render the breadcrumb item link.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <a href={props.url} onClick={this.handleOnClick}
                    className={this.formatClass(props.className)}>
                    {props.children}
                    <span className="caret">{props.caret}</span>
                </a>
            </li>
        );
    }
}

Item.defaultProps = {
    caret: '/'
};

Item.propTypes = {
    children: PropTypes.node.isRequired,
    className: cssClassName,
    url: PropTypes.string.isRequired,
    caret: PropTypes.node,
    onClick: collectionOf.func
};
