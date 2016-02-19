/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClassName from '../../prop-types/cssClassName';

export default class Item extends Component {
    static defaultProps = {
        className: ['step', 'item'],
        complete: false
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        complete: PropTypes.bool
    };

    /**
     * Render the step item.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <button
                    type="button" role="button"
                    className={this.formatClass(props.className, {
                        'is-complete': props.complete
                    })}
                    {...this.inheritNativeProps(props)}>

                    {props.children}
                </button>
            </li>
        );
    }
}
