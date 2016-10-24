/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import emitEvent from '../../utility/emitEvent';
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

  constructor(props, context) {
    super();

    this.state = {
      expanded: this.getContext(context).isSectionActive(props.index),
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    this.setState({
      expanded: this.getContext(nextContext).isSectionActive(nextProps.index),
    });
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.expanded !== this.state.expanded);
  }

  componentWillUpdate() {
    emitEvent(this, this.state.expanded ? 'onHiding' : 'onShowing');
  }

  componentDidUpdate() {
    emitEvent(this, this.state.expanded ? 'onShown' : 'onHidden');
  }

  render() {
    const { children, index } = this.props;
    const { expanded } = this.state;

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
      >
        {children}
      </section>
    );
  }
}
