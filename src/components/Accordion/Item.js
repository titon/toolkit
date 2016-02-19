/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslints react/jsx-handler-names: 0 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Header from './Header';
import Section from './Section';
import collection from '../../prop-types/collection';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Item extends Component {
    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        header: PropTypes.node.isRequired,
        headerClassName: cssClass,
        sectionClassName: cssClass,
        onClickHeader: collection.func,
        onHiding: collection.func,
        onHidden: collection.func,
        onShowing: collection.func,
        onShown: collection.func
    };

    state = {
        expanded: false
    };

    /**
     * Verify the `expanded` state.
     *
     * @param {Object} props
     * @param {Object} context
     */
    constructor(props, context) {
        super();

        /* eslint react/no-direct-mutation-state: 0 */
        this.state.expanded = context.isItemActive(props.index);
    }

    /**
     * Determine whether the section is expanded or not.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            expanded: nextContext.isItemActive(nextProps.index)
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
     * Render the accordion item and pass all relevant props to the sub-children.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            expanded = this.state.expanded;

        return (
            <li>
                <Header
                    className={props.headerClassName}
                    index={props.index}
                    active={expanded}
                    onClick={props.onClickHeader}>

                    {props.header}
                </Header>

                <Section
                    className={props.sectionClassName}
                    index={props.index}
                    expanded={expanded}
                    {...this.inheritNativeProps(props)}>

                    {props.children}
                </Section>
            </li>
        );
    }
}
