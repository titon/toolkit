import React from 'react';

export default class Accordion extends React.Component {
    constructor() {
        super();

        this.version = '3.0.0';
        this.state = {
            index: this.props.defaultIndex,
            items: []
        };
    }

    render() {
        return (
            <ul class="accordion" id="accordion" role="tablist">
                {this.state.items.map((item, i) => {
                    return (
                        <AccordionRow
                            key={item.key}
                            index={i}
                            currentIndex={this.state.index}
                            header={item.header}
                            section={item.section}
                            onClickHeader={this.onClickHeader.bind(this, i)} />
                    );
                })}
            </ul>
        );
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            likesIncreasing: nextProps.index
        });
    }

    onClickHeader(index, e) {

    }
}

Accordion.defaultProps = {
    mode: 'click',
    defaultIndex: 0,
    multiple: false,
    collapsible: false
};

Accordion.propTypes = {
    mode: React.PropTypes.string,
    defaultIndex: React.PropTypes.number,
    multiple: React.PropTypes.bool,
    collapsible: React.PropTypes.bool
};

/*----------------------------------------------------------------------------------------------------*/

export class AccordionRow extends React.Component {
    render() {
        return (
            <li>
                <AccordionHeader index={this.props.index} onClick={this.props.onClickHeader}>
                    {this.props.header}
                </AccordionHeader>
                <AccordionSection index={this.props.index}>
                    {this.props.section}
                </AccordionSection>
            </li>
        );
    }
}

AccordionRow.defaultProps = {
    key: '',
    index: 0,
    header: '',
    section: ''
};

AccordionRow.propTypes = {
    key: React.PropTypes.string.isRequired,
    index: React.PropTypes.number,
    header: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
    ]),
    section: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.element
    ])
};

Accordion.Row = AccordionRow;

/*----------------------------------------------------------------------------------------------------*/

export class AccordionSection extends React.Component {
    render() {
        return (
            <section
                id={this.formatID('section', index)}
                class="accordion-section"
                role="tabpanel"
                aria-labelledby={this.formatID('header', index)}>

                <div class="accordion-body">
                    {this.props.children}
                </div>
            </section>
        );
    }
}

Accordion.Section = AccordionSection;

/*----------------------------------------------------------------------------------------------------*/

export class AccordionHeader extends React.Component {
    render() {
        let index = this.props.index;

        return (
            <header
                id={this.formatID('header', index)}
                class="accordion-header"
                role="tab"
                data-accordion-index={index}
                aria-controls={this.formatID('section', index)}
                aria-selected={false}
                aria-expanded={false}
                onClick={this.props.onClick}>

                {this.props.children}
            </header>
        );
    }
}

Accordion.Header = AccordionHeader;
