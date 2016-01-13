/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Component from '../../../Component';
import autoBind from '../../../decorators/autoBind';
import cssClassName from '../../../ext/prop-types/cssClassName';
import debounce from '../../../decorators/debounce';

@autoBind
export default class SlideCollapse extends Component {
    constructor() {
        super();

        this.state = {
            size: -1
        };
    }

    /**
     * Bind events.
     */
    componentWillMount() {
        window.addEventListener('resize', this.handleOnResize);
    }

    /**
     * Once mounted, calculate the raw width or height of the element.
     */
    componentDidMount() {
        this.calculateSize();
    }

    /**
     * Unbind events.
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.handleOnResize);
    }

    /**
     * Calculate the width or height of the element by cloning it, forcing a size,
     * appending the element to the current DOM, saving the size,
     * and finally removing the clone.
     */
    calculateSize() {
        let node = ReactDOM.findDOMNode(this).cloneNode(true),
            body = document.body;

        node.style.maxWidth = '100%';
        node.style.maxHeight = '100%';
        body.appendChild(node);

        this.setState({
            size: (this.props.direction === 'vertical') ? node.offsetHeight : node.offsetWidth
        });

        body.removeChild(node);
    }

    /**
     * When the browser is resized, re-calculate the element width or height.
     */
    @debounce(100)
    handleOnResize() {
        this.calculateSize();
    }

    /**
     * Render the wrapper that triggers slide collapse transitions.
     * Requires a literal size of the element to work correctly.
     *
     * @returns {JSX}
     */
    render() {
        let style = {},
            props = this.props,
            className = this.formatClass(props.className, 'transition', {
                ['@' + props.direction]: true,
                'is-expanded': props.expanded
            });

        // Don't force a max on the initial render
        if (this.state.size >= 0 && props.expanded) {
            style = {
                [(props.direction === 'vertical') ? 'maxHeight' : 'maxWidth']: this.state.size
            };
        }

        return (
            <div className={className} style={style}>
                {props.children}
            </div>
        );
    }
}

SlideCollapse.defaultProps = {
    className: ['slide', 'collapse'],
    direction: 'vertical',
    expanded: true
};

SlideCollapse.propTypes = {
    children: PropTypes.node,
    className: cssClassName.isRequired,
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
    expanded: PropTypes.bool.isRequired
};
