/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import CookieJar from '../../machines/CookieJar';
import DocumentState from '../../machines/DocumentState';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Tabs extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static defaultProps = {
    collapsible: false,
    cookieDuration: 30,
    defaultIndex: 0,
    fragments: [],
    persistState: false,
    useCookie: true,
    useFragment: true,
  };

  static propTypes = {
    children: PropTypes.node,
    collapsible: PropTypes.bool,
    cookieDuration: PropTypes.number,
    defaultIndex: collectionOf.number,
    fragments: PropTypes.arrayOf(PropTypes.shape({
      hash: PropTypes.string,
      index: PropTypes.number,
    })),
    persistState: PropTypes.bool,
    useCookie: PropTypes.bool,
    useFragment: PropTypes.bool,
  };

  state = {
    index: -1,
  };

  /**
   * Define a context that is passed to all children.
   *
   * @returns {Object}
   */
  getChildContext() {
    return {
      [MODULE.contextKey]: {
        activeIndex: this.state.index,
        hideSection: this.hideSection,
        isSectionActive: this.isSectionActive,
        isSectionCollapsible: this.isSectionCollapsible,
        showSection: this.showSection,
        toggleSection: this.toggleSection,
        uid: this.getUID(),
      },
    };
  }

  /**
   * Set the default index before mounting.
   */
  componentWillMount() {
    let props = this.props,
      index = null;

    // Persist the state through a cookie or fragment
    if (props.persistState) {
        // Load from a cookie
      if (props.useCookie) {
        index = CookieJar.get(`tabs.${this.getUID()}`);
      }

        // Load from the fragment
      if (index === null && props.useFragment && location.hash) {
        const fragment = props.fragments.find(frag => frag.hash === location.hash.substr(1));

        if (fragment) {
          index = fragment.index;
        }
      }
    }

    // Fallback to the default index
    if (index === null) {
      index = props.defaultIndex;
    }

    // Cast to number since cookies return strings
    this.showSection(Number(index));
  }

  /**
   * Only update if the index is different.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @returns {Boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.index !== this.state.index);
  }

  /**
   * Persist the state through a cookie.
   */
  componentDidUpdate() {
    let props = this.props,
      index = this.state.index;

    if (props.persistState) {
      if (props.useCookie) {
        CookieJar.set(`tabs.${this.getUID()}`, index, {
          expires: props.cookieDuration,
        });
      }

      if (props.useFragment) {
        const fragment = props.fragments.find(frag => frag.index === index);

        if (fragment) {
          DocumentState.updateFragment(fragment.hash);
        }
      }
    }
  }

  /**
   * Conceal a section by removing its index from the active state.
   *
   * @param {Number} index
   */
  @bind
  hideSection(index) {
    if (this.state.index === index) {
      this.setState({
        index: -1,
      });
    }
  }

  /**
   * Returns true if the section at the specified index can be collapsed.
   *
   * @param {Number} index
   * @returns {Boolean}
   */
  @bind
  isSectionCollapsible(index) {
    return (this.props.collapsible && this.isSectionActive(index));
  }

  /**
   * Returns true if the section at the specified index is active.
   *
   * @param {Number} index
   * @returns {Boolean}
   */
  @bind
  isSectionActive(index) {
    return (this.state.index === index);
  }

  /**
   * Reveal the section at the defined index, and collapse all other sections.
   *
   * @param {Number} index
   */
  @bind
  showSection(index) {
    this.setState({
      index,
    });
  }

  /**
   * Toggle the display state of a specific index.
   *
   * @param {Number} index
   */
  @bind
  toggleSection(index) {
    if (this.isSectionCollapsible(index)) {
      this.hideSection(index);
    } else {
      this.showSection(index);
    }
  }

  /**
   * Render the wrapping tabs element.
   *
   * @returns {ReactElement}
   */
  render() {
    const props = this.props;

    return (
      <div
        role="tablist"
        id={this.formatID('tabs')}
        className={this.formatClass({
          'is-collapsible': props.collapsible,
        })}
        aria-live="off"
      >
        {props.children}
      </div>
    );
  }
}
