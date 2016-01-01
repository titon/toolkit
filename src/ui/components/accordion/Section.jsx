/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import SlideCollapse from '../../transitions/slide-collapse';
import { CONTEXT_TYPES } from './ContextTypes';

export default class Section extends Component {
    /**
     * Render the accordion item section content and wrap with a collapsible slide transition.
     *
     * @returns {JSX}
     */
    render() {
        let index = this.props.index,
            expanded = this.props.expanded;

        return (
            <SlideCollapse expanded={expanded}>
                <section role="tabpanel"
                    id={this.formatID('accordion-section', index)}
                    className={this.formatClass(this.props.className, {
                        'is-expanded': expanded
                    })}
                    aria-labelledby={this.formatID('accordion-header', index)}
                    aria-hidden={!expanded}
                    aria-expanded={expanded}>

                    {this.props.children}
                </section>
            </SlideCollapse>
        );
    }
}

Section.contextTypes = CONTEXT_TYPES;
