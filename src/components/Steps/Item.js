/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import MODULE from './module';

export default class Item extends Component {
    static module = MODULE;

    static defaultProps = {
        complete: false
    };

    static propTypes = {
        children: PropTypes.node,
        complete: PropTypes.bool
    };

    /**
     * Render the individual step item.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <li>
                <button
                    type="button" role="button"
                    className={this.formatChildClass('item', {
                        'is-complete': props.complete
                    })}
                    {...this.inheritNativeProps(props)}
                >
                    {props.children}
                </button>
            </li>
        );
    }
}
