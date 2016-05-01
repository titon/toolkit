/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import bind from '../../decorators/bind';
import formatInputName from '../../utility/formatInputName';
import CONTEXT_TYPES from './ContextTypes2';
import MODULE from './module';

export default class Group extends Component {
    static module = MODULE;

    static childContextTypes = CONTEXT_TYPES;

    static defaultProps = {
        defaultChecked: ''
    };

    static propTypes = {
        defaultChecked: PropTypes.string,
        name: PropTypes.string.isRequired
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
    }

    /**
     * Define a context that is passed to all children.
     *
     * @returns {Object}
     */
    getChildContext() {
        let name = this.props.name;

        return {
            checkedValue: this.state.value,
            inputID: formatInputName(name),
            inputName: name,
            selectValue: this.selectValue,
            uid: this.getUID()
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
                className={this.formatChildClass('group')}
                {...this.inheritNativeProps(props)}
            >
                {props.children}
            </div>
        );
    }
}
