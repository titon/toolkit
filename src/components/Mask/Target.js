/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Target extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['mask', 'target']
    };

    static propTypes = {
        children: PropTypes.node,
        className: cssClass,
        elementClassName: cssClass.isRequired
    };

    state = {
        expanded: false
    };

    /**
     * Determine whether the mask is expanded or not.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            expanded: nextContext.expanded
        });
    }

    /**
     * Only update if the `expanded` state is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.expanded !== this.state.expanded);
    }

    /**
     * Render the mask target by transferring state to the child.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            expanded = this.state.expanded;

        return (
            <div
                id={this.formatID('mask-target')}
                className={this.formatClass(props.elementClassName, props.className, {
                    'is-masked': expanded
                })}
                aria-controls={this.formatID('mask-overlay')}
                aria-expanded={expanded}>

                {props.children}
            </div>
        );
    }

}
