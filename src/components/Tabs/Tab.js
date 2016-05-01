/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import tabIndex from '../../utility/tabIndex';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Tab extends Component {
    static module = MODULE;

    static contextTypes = CONTEXT_TYPES;

    static propTypes = {
        children: PropTypes.node,
        fragment: PropTypes.string,
        index: PropTypes.number.isRequired,
        onClick: collectionOf.func
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
            active: context.isSectionActive(props.index)
        };
    }

    /**
     * Determine whether the tab is active not.
     *
     * @param {Object} nextProps
     * @param {Object} nextContext
     */
    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({
            active: nextContext.isSectionActive(nextProps.index)
        });
    }

    /**
     * Only update if the active state is different.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.active !== this.state.active);
    }

    /**
     * Update the index on the parent component when clicked.
     *
     * @param {SyntheticEvent} e
     */
    @bind
    handleOnClick(e) {
        this.context.toggleSection(this.props.index);

        this.handleEvent('click', e);
    }

    /**
     * Render the tabs navigation tab.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props,
            index = props.index,
            active = this.state.active;

        return (
            <li>
                <button
                    type="button" role="tab"
                    id={this.formatID('tabs-tab', index)}
                    className={this.formatChildClass('tab', {
                        'is-active': active
                    })}
                    aria-controls={this.formatID('tabs-section', index)}
                    aria-selected={active}
                    aria-expanded={active}
                    tabIndex={tabIndex(this)}
                    onClick={this.handleOnClick}
                >
                    {props.children}
                </button>
            </li>
        );
    }
}
