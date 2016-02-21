/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import cssClass from '../../prop-types/cssClass';
import CONTEXT_TYPES from './ContextTypes';

export default class Group extends Component {
    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        elementClassName: ['radio', 'group'],
        defaultChecked: ''
    };

    static propTypes = {
        className: cssClass,
        elementClassName: cssClass.isRequired,
        name: PropTypes.string.isRequired,
        defaultChecked: PropTypes.string
    };

    /**
     * Setup state.
     *
     * @param {Object} props
     */
    constructor(props) {
        super();

        this.state = {
            value: props.defaultChecked
        };

        this.generateUID();
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        return {
            uid: this.uid,
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
     * @param {String} value
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
                id={this.formatID('radio-group')}
                className={this.formatClass(props.elementClassName, props.className)}
                {...this.inheritNativeProps(props)}>

                {props.children}
            </div>
        );
    }
}
