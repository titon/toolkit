import React, { PropTypes } from 'react';
import Component from '../Component';

export default class Button extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <button type="button" role="button" className="button">
                {this.props.children}
            </button>
        );
    }
}

Button.defaultProps = {
    url: '',
    size: '',
    shape: '',
    state: '',
    modifier: '',
    disabled: false
};

Button.propTypes = {
    url: PropTypes.string,
    size: PropTypes.oneOf(['small', 'large']),
    shape: PropTypes.oneOf(['round', 'oval', 'pill', 'skew']),
    state: PropTypes.oneOf(['info', 'success', 'warning', 'error', 'debug']),
    modifier: PropTypes.oneOf(['gloss', 'reflect', 'glare', 'popout']),
    disabled: PropTypes.bool
};
