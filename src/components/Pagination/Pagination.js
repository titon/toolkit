/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import Item from './Item';
import Spacer from './Spacer';
import bind from '../../decorators/bind';
import collectionOf from '../../prop-types/collectionOf';
import generateUID from '../../utility/generateUID';
import emitEvent from '../../utility/emitEvent';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

export default class Pagination extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  static defaultProps = {
    currentPage: 1,
    edges: 5,
    first: 'First',
    format: 'around',
    grouped: false,
    label: 'Pagination',
    last: 'Last',
    next: 'Next',
    prev: 'Prev',
    showControls: false,
    spacer: '...',
  };

  static propTypes = {
    currentPage: PropTypes.number,
    edges: PropTypes.number,
    first: PropTypes.node,
    format: PropTypes.oneOf(['around', 'spaced']),
    grouped: PropTypes.bool,
    label: PropTypes.string,
    last: PropTypes.node,
    next: PropTypes.node,
    onPaged: collectionOf.func,
    onPaging: collectionOf.func,
    prev: PropTypes.node,
    showControls: PropTypes.bool,
    spacer: PropTypes.string,
    totalPages: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired,
  };

  uid = generateUID();

  constructor(props) {
    super();

    this.state = {
      page: this.clampPage(props.currentPage, props.totalPages),
    };
  }

  getChildContext() {
    return {
      [MODULE.contextKey]: {
        currentPage: this.state.page,
        goToPage: this.goToPage,
        nextPage: this.nextPage,
        prevPage: this.prevPage,
        totalPages: this.props.totalPages,
        uid: this.uid,
        url: this.props.url,
      },
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextState.page !== this.state.page);
  }

  componentWillUpdate(nextProps, nextState) {
    emitEvent(this, 'onPaging', nextState.page, this.state.page);
  }

  componentDidUpdate(prevProps, prevState) {
    emitEvent(this, 'onPaged', this.state.page, prevState.page);
  }

  clampPage(page, total) {
    // eslint-disable-next-line no-nested-ternary
    return (page < 1) ? 1 : ((page > total) ? total : page);
  }

  createItem(page) {
    return (
      <Item key={page} page={page} />
    );
  }

  createSpacer(key) {
    return (
      <Spacer key={key}>{this.props.spacer}</Spacer>
    );
  }

  @bind
  goToPage(page) {
    this.setState({
      page: this.clampPage(page, this.props.totalPages),
    });
  }

  @bind
  nextPage() {
    this.goToPage(this.state.page + 1);
  }

  @bind
  prevPage() {
    this.goToPage(this.state.page - 1);
  }

  renderItems() {
    const { totalPages, edges, format } = this.props;
    const { page } = this.state;
    const items = [];
    let start = 1;
    let stop = totalPages;
    let half = 0;
    let i = 0;

    switch (format) {

      // There should be `edge` items on each side of the current page
      case 'around':
      default:
        if (totalPages < (edges * 2)) {
          break;
        }

        start = page - edges;
        stop = page + edges;

        // Fix the differences
        while (start < 1) {
          start += 1;
          stop += 1;
        }

        while (stop > totalPages) {
          start -= 1;
          stop -= 1;
        }

        break;

      // There should be `edge` items in the middle, with ellipsis spacers on each side
      case 'spaced':
        half = Math.floor(edges / 2);

        if (totalPages < (edges + ((half + 1) * 2))) {
          break;
        }

        // Items on the left side, a single spacer on the right
        if (page < (edges + half)) {
          for (i = 1; i <= (edges + half); i += 1) {
            items.push(this.createItem(i));
          }

          items.push(this.createSpacer('right'));

          for (i = ((totalPages - half) + 1); i <= totalPages; i += 1) {
            items.push(this.createItem(i));
          }

        // Items on the right side, a single spacer on the left
        } else if (page > ((totalPages - half) - edges)) {
          for (i = 1; i <= half; i += 1) {
            items.push(this.createItem(i));
          }

          items.push(this.createSpacer('left'));

          for (i = ((totalPages - half - edges) + 1); i <= totalPages; i += 1) {
            items.push(this.createItem(i));
          }

        // Items in the middle, spacers on each side
        } else {
          for (i = 1; i <= half; i += 1) {
            items.push(this.createItem(i));
          }

          items.push(this.createSpacer('left'));

          for (i = (page - half); i <= (page + half); i += 1) {
            items.push(this.createItem(i));
          }

          items.push(this.createSpacer('right'));

          for (i = ((totalPages - half) + 1); i <= totalPages; i += 1) {
            items.push(this.createItem(i));
          }
        }

        return items;
    }

    for (i = start; i <= stop; i += 1) {
      items.push(this.createItem(i));
    }

    return items;
  }

  render() {
    const {
      first,
      last,
      next,
      prev,
      grouped,
      label,
      totalPages,
      showControls,
    } = this.props;
    const { page } = this.state;
    let items = [];

    // Prepend first and previous
    if (first && (page > 1 || showControls)) {
      items.push(
        <Item key="first" page={1}>{first}</Item>,
      );
    }

    if (prev && (page > 1 || showControls)) {
      items.push(
        <Item key="prev" page={page - 1}>{prev}</Item>,
      );
    }

    // Generate the list of items
    items = items.concat(this.renderItems());

    // Append next and last
    if (next && (page < totalPages || showControls)) {
      items.push(
        <Item key="next" page={page + 1}>{next}</Item>,
      );
    }

    if (last && (page < totalPages || showControls)) {
      items.push(
        <Item key="last" page={totalPages}>{last}</Item>,
      );
    }

    return (
      <nav
        role="navigation"
        id={this.formatID('pagination')}
        className={this.formatClass({
          '@grouped': grouped,
        })}
        aria-label={label}
      >
        <ol>
          {items}
        </ol>
      </nav>
    );
  }
}
