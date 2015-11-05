import React from 'react';

export default class Button extends React.Component {
    constructor() {
        super();

        this.state = {
            disabled: false,
            pressed: false
        };
    }

    componentWillReceiveProps(nextProps) {

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
    url: React.PropTypes.string,
    size: React.PropTypes.oneOf(['small', 'large']),
    shape: React.PropTypes.oneOf(['round', 'oval', 'pill', 'skew']),
    state: React.PropTypes.oneOf(['info', 'success', 'warning', 'error', 'debug']),
    modifier: React.PropTypes.oneOf(['gloss', 'reflect', 'glare', 'popout']),
    disabled: React.PropTypes.bool
};
