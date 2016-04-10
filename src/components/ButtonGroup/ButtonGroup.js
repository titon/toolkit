/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';

export default class ButtonGroup extends Component {
    static defaultProps = {
        elementClassName: 'button-group',
        label: 'Button Group'
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired,
        justified: PropTypes.bool,
        label: PropTypes.string,
        vertical: PropTypes.bool
    };

    /**
     * Generate a UID.
     */
    constructor() {
        super();

        this.generateUID();
    }

    /**
     * Render the button group as a list of buttons.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <ul
                role="toolbar"
                id={this.formatID('button-group')}
                className={this.formatClass(props.elementClassName, props.className, {
                    ['@justified']: Boolean(props.justified),
                    ['@vertical']: Boolean(props.vertical)
                })}
                aria-label={props.label}
                aria-orientation={props.vertical ? 'vertical' : 'horizontal'}
                {...this.inheritNativeProps(props)}>

                {Children.map(props.children, child => (
                    <li>{child}</li>
                ))}
            </ul>
        );
    }
}
