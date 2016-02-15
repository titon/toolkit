/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClassName from '../../prop-types/cssClassName';
import CONTEXT_TYPES from './ContextTypes';

export default class Group extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        className: ['radio', 'group']
    };

    static propTypes = {
        className: cssClassName.isRequired,
        uniqueClassName: cssClassName,
        name: PropTypes.string.isRequired,
        defaultChecked: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    /**
     * Setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        // Build the state here instead of using ES7 properties
        this.state = {
            value: props.defaultChecked || ''
        };
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            inputName: this.props.name,
            checkedValue: this.state.value,
            selectValue: this.selectValue
        };
    }

    /**
     * Only update if the selected value changes.
     *
     * @param {Object} nextProps
     * @param {Object} nextState
     * @returns {Boolean}
     */
    shouldComponentUpdate(nextProps, nextState) {
        return (nextState.value !== this.state.value);
    }

    /**
     * Select a value to mark a radio as checked.
     *
     * @param {String|Number} value
     */
    @bind
    selectValue(value) {
        this.setState({
            value
        });
    }

    /**
     * Render a simple radio group container.
     *
     * @returns {ReactElement}
     */
    render() {
        let props = this.props;

        return (
            <div
                className={this.formatClass(props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
