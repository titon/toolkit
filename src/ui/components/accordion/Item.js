/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

/* eslint react/jsx-handler-names: 0 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Header from './Header';
import Section from './Section';
import collectionOf from '../../../ext/prop-types/collectionOf';
import cssClassName from '../../../ext/prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Item extends Component {

    /**
     * Render the accordion item and pass all relevant props to the sub-children.
     *
     * @returns {JSX}
     */
    render() {
        let props = this.props,
            active = this.context.isItemActive(props.index);

        return (
            <li>
                <Header
                    className={props.headerClassName}
                    index={props.index}
                    active={active}
                    onClick={props.onClick}>

                    {props.header}
                </Header>

                <Section
                    className={props.sectionClassName}
                    index={props.index}
                    expanded={active}>

                    {props.children}
                </Section>
            </li>
        );
    }
}

Item.contextTypes = CONTEXT_TYPES;

Item.propTypes = {
    index: PropTypes.number.isRequired,
    header: PropTypes.node.isRequired,
    headerClassName: cssClassName,
    sectionClassName: cssClassName,
    onClick: collectionOf.func
};
