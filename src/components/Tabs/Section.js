/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import { showHidePropTypes } from '../../propTypes';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Section extends Component {
  static module = MODULE;

  static contextTypes = CONTEXT_TYPES;

  static propTypes = {
    ...showHidePropTypes,
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
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
      expanded: this.getContext(context).isSectionActive(props.index),
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
      expanded: this.getContext(nextContext).isSectionActive(nextProps.index),
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
        className={this.formatChildClass('section', {
          'is-expanded': expanded,
        })}
        aria-labelledby={this.formatID('tabs-tab', index)}
        aria-hidden={!expanded}
        aria-expanded={expanded}
        {...this.inheritNativeProps(props)}
      >
        {props.children}
      </section>
        );
  }
}
