/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class Item extends Component {
    static defaultProps = {
        complete: false,
        elementClassName: ['steps', 'item']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        complete: PropTypes.bool,
        elementClassName: cssClass.isRequired
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
                    className={this.formatClass(props.elementClassName, props.className, {
                        'is-complete': props.complete
                    })}
                    {...this.inheritNativeProps(props)}>

                    {props.children}
                </button>
            </li>
        );
    }
}
