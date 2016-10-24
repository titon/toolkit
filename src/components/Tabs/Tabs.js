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
import generateUID from '../../utility/generateUID';
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

  uid = generateUID();

  getChildContext() {
    return {
      [MODULE.contextKey]: {
        activeIndex: this.state.index,
        hideSection: this.hideSection,
        isSectionActive: this.isSectionActive,
        isSectionCollapsible: this.isSectionCollapsible,
        showSection: this.showSection,
        toggleSection: this.toggleSection,
        uid: this.uid,
      },
    };
  }

  componentWillMount() {
    const { persistState, useCookie, useFragment, fragments, defaultIndex } = this.props;
    let index = null;

    // Persist the state through a cookie or fragment
    if (persistState) {
      // Load from a cookie
      if (useCookie) {
        index = CookieJar.get(`tabs.${this.uid}`);
      }

      // Load from the fragment
      if (index === null && useFragment && location.hash) {
        const fragment = fragments.find(frag => frag.hash === location.hash.substr(1));

        if (fragment) {
          index = fragment.index;
        }
      }
    }

    // Fallback to the default index
    if (index === null) {
      index = defaultIndex;
    }

    // Cast to number since cookies return strings
    this.showSection(Number(index));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.index !== this.state.index);
  }

  componentDidUpdate() {
    const { persistState, useCookie, cookieDuration, useFragment, fragments } = this.props;
    const { index } = this.state;

    if (persistState) {
      if (useCookie) {
        CookieJar.set(`tabs.${this.uid}`, index, {
          expires: cookieDuration,
        });
      }

      if (useFragment) {
        const fragment = fragments.find(frag => frag.index === index);

        if (fragment) {
          DocumentState.updateFragment(fragment.hash);
        }
      }
    }
  }

  @bind
  hideSection(index) {
    if (this.state.index === index) {
      this.setState({
        index: -1,
      });
    }
  }

  @bind
  isSectionCollapsible(index) {
    return (this.props.collapsible && this.isSectionActive(index));
  }

  @bind
  isSectionActive(index) {
    return (this.state.index === index);
  }

  @bind
  showSection(index) {
    this.setState({
      index,
    });
  }

  @bind
  toggleSection(index) {
    if (this.isSectionCollapsible(index)) {
      this.hideSection(index);
    } else {
      this.showSection(index);
    }
  }

  render() {
    const { children, collapsible } = this.props;

    return (
      <div
        role="tablist"
        id={this.formatID('tabs')}
        className={this.formatClass({
          'is-collapsible': collapsible,
        })}
        aria-live="off"
      >
        {children}
      </div>
    );
  }
}
