/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classBuilder from '../../ext/utility/classBuilder';
import debounce from 'lodash/function/debounce';

export default class SlideCollapse extends React.Component {
    constructor() {
        super();

        this.state = {
            maxHeight: -1
        };

        this.onResizeHandler = debounce(this.onResize.bind(this), 100);
    }

    /**
     * Render the wrapper that triggers slide collapse transitions.
     * Requires a literal height of the element to work correctly.
     *
     * @returns {JSX}
     */
    render() {
        let style = {},
            className = classBuilder(
                'transition',
                'slide-' + this.props.direction,
                { 'show': this.props.visible }
            );

        // Don't force a max height on the initial render
        if (this.state.maxHeight >= 0 && this.props.visible) {
            style = {
                maxHeight: this.state.maxHeight
            };
        }

        return (
            <div className={className} style={style}>
                {this.props.children}
            </div>
        );
    }

    /**
     * Calculate the height of the element by cloning it, forcing a ma height,
     * appending the element to the current DOM, saving the height,
     * and finally removing the clone.
     */
    calculateHeight() {
        let node = ReactDOM.findDOMNode(this).cloneNode(true),
            body = document.body;

        node.style.maxHeight = '100%';
        body.appendChild(node);

        this.setState({
            maxHeight: node.offsetHeight
        });

        body.removeChild(node);
    }

    /**
     * Once mounted, calculate the raw height of the element.
     */
    componentDidMount() {
        this.calculateHeight();
    }

    /**
     * Bind events.
     */
    componentWillMount() {
        window.addEventListener('resize', this.onResizeHandler);
    }

    /**
     * Unbind events.
     */
    componentWillUnmount() {
        window.removeEventListener('resize', this.onResizeHandler);
    }

    /**
     * When the browser is resized, re-calculate the element height.
     */
    onResize() {
        this.calculateHeight();
    }
}

SlideCollapse.defaultProps = {
    direction: 'vertical',
    visible: true
};

SlideCollapse.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizontal']),
    visible: PropTypes.bool.isRequired
};
