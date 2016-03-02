/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Section extends Component {
    static contextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['tabs', 'section']
    };

    static propTypes = {
        children: PropTypes.node,
        elementClassName: cssClass.isRequired,
        index: PropTypes.number.isRequired,
        onHiding: collection.func,
        onHidden: collection.func,
        onShowing: collection.func,
        onShown: collection.func
    };

    /**
     * Setup the state.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        this.state = {
            expanded: context.isSectionActive(props.index)
        };
    }

    /**
     * Determine whether the section is expanded or not.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            expanded: nextContext.isSectionActive(nextProps.index)
        });
    }

    /**
     * Only update if the expanded state is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.expanded !== this.state.expanded);
    }

    /**
     * Emit `showing` or `hiding` events before rendering.
     */
    componentWillUpdate() {
        this.emitEvent(this.state.expanded ? 'hiding' : 'showing');
    }

    /**
     * Emit `shown` or `hidden` events after rendering.
     */
    componentDidUpdate() {
        this.emitEvent(this.state.expanded ? 'shown' : 'hidden');
    }

    /**
     * Render the tabs section content.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            index = props.index,
            expanded = this.state.expanded;

        return (
            <section
                role="tabpanel"
                id={this.formatID('tabs-section', index)}
                className={this.formatClass(props.elementClassName, {
                    'is-expanded': expanded
                })}
                aria-labelledby={this.formatID('tabs-tab', index)}
                aria-hidden={!expanded}
                aria-expanded={expanded}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </section>
        );
    }
}
