import React from 'react';
import Component from './Component.jsx';
import generateUID from '../../extensions/utility/generateUID2';
import validateChildrenPropType from '../../extensions/utility/validateChildrenPropType';
import debounce from 'lodash/function/debounce';

/*----------------------------------------------------------------------------------------------------*/

export class AccordionHeader extends Component {
    render() {
        let isActive = (this.props.index === this.props.currentIndex);

        return (
            <header role="tab"
                id={this.formatID('accordion-header')}
                className={this.formatClass(this.props.className, {
                    'is-active': isActive
                })}
                aria-controls={this.formatID('accordion-section')}
                aria-selected={isActive}
                aria-expanded={isActive}
                onClick={this.props.onClick}>

                {this.props.children}
            </header>
        );
    }
}

AccordionHeader.defaultProps = {
    className: 'accordion-header',
    index: -1,
    currentIndex: 0,
    onClick: null
};

AccordionHeader.propTypes = {
    className: React.PropTypes.string,
    index: React.PropTypes.number,
    currentIndex: React.PropTypes.number,
    onClick: React.PropTypes.func.isRequired
};

/*----------------------------------------------------------------------------------------------------*/

export class AccordionSection extends Component {
    render() {
        let isActive = (this.props.index === this.props.currentIndex);

        return (
            <section role="tabpanel"
                id={this.formatID('accordion-section')}
                className={this.formatClass(this.props.className, {
                    show: isActive,
                    hide: !isActive
                })}
                aria-labelledby={this.formatID('accordion-header')}>

                <div className={this.formatClass(this.props.bodyClassName)}>
                    {this.props.children}
                </div>
            </section>
        );
    }
}

AccordionSection.defaultProps = {
    className: 'accordion-section',
    bodyClassName: 'accordion-body',
    index: -1,
    currentIndex: 0
};

AccordionSection.propTypes = {
    className: React.PropTypes.string,
    bodyClassName: React.PropTypes.string,
    index: React.PropTypes.number,
    currentIndex: React.PropTypes.number
};

/*----------------------------------------------------------------------------------------------------*/

export class AccordionItem extends Component {
    render() {
        return (
            <li>
                <AccordionHeader
                    className={this.props.headerClassName}
                    uid={this.props.uid}
                    index={this.props.index}
                    currentIndex={this.props.currentIndex}
                    onClick={this.props.onClickHeader}>

                    {this.props.header}
                </AccordionHeader>

                <AccordionSection
                    className={this.props.sectionClassName}
                    bodyClassName={this.props.bodyClassName}
                    uid={this.props.uid}
                    index={this.props.index}
                    currentIndex={this.props.currentIndex}>

                    {this.props.children}
                </AccordionSection>
            </li>
        );
    }
}

AccordionItem.defaultProps = {
    uid: '',
    index: -1,
    currentIndex: 0,
    header: '',
    headerClassName: 'accordion-header',
    sectionClassName: 'accordion-section',
    bodyClassName: 'accordion-body',
    onClickHeader: null
};

AccordionItem.propTypes = {
    uid: React.PropTypes.string,
    index: React.PropTypes.number,
    currentIndex: React.PropTypes.number,
    header: React.PropTypes.node,
    headerClassName: React.PropTypes.string,
    sectionClassName: React.PropTypes.string,
    bodyClassName: React.PropTypes.string,
    onClickHeader: React.PropTypes.func
};

/*----------------------------------------------------------------------------------------------------*/

export default class Accordion extends Component {
    constructor() {
        super();

        this.version = '3.0.0';
        this.uid = generateUID();
        this.state = {
            index: 0
        };

        this.onHorizontalResize = this.onHorizontalResize.bind(this);
    }

    render() {
        return (
            <ul role="tablist"
                id={this.formatID('accordion')}
                className={this.formatClass(this.props.className)}>

                {React.Children.map(this.props.children, function(child, index) {
                    return React.cloneElement(child, {
                        ref: 'item-' + index,
                        uid: this.uid,
                        index: index,
                        currentIndex: this.state.index,
                        onClickHeader: this.onClickHeader.bind(this, index)
                    });
                }, this)}
            </ul>
        );
    }

    componentDidMount() {
        console.log('componentDidMount', arguments);
    }

    componentWillMount() {
        console.log('componentWillMount', arguments, this);

        this.setState({
            index: this.props.defaultIndex
        });

        window.addEventListener('resize', debounce(this.onHorizontalResize, 150));
    }

    componentWillUnmount() {
        console.log('componentWillUnmount', arguments);

        window.removeEventListener('resize', debounce(this.onHorizontalResize, 150));
    }

    componentWillReceiveProps(nextProps) {
        console.log('componentWillReceiveProps', nextProps);
    }

    shouldComponentUpdate() {
        console.log('shouldComponentUpdate', arguments);
        return true;
    }

    componentWillUpdate() {
        console.log('componentWillUpdate', arguments);
    }

    componentDidUpdate() {
        console.log('componentDidUpdate', arguments);
    }

    onClickHeader(index, e) {
        e.preventDefault();

        this.setState({
            index: index
        });
    }

    onHorizontalResize(e) {
        console.log('onHorizontalResize', e);
    }
}

Accordion.defaultProps = {
    className: 'accordion',
    defaultIndex: 0,
    multiple: false,
    collapsible: false
};

Accordion.propTypes = {
    children: validateChildrenPropType(AccordionItem),
    className: React.PropTypes.string,
    defaultIndex: React.PropTypes.number,
    multiple: React.PropTypes.bool,
    collapsible: React.PropTypes.bool
};

Accordion.Header = AccordionHeader;
Accordion.Section = AccordionSection;
Accordion.Item = AccordionItem;
