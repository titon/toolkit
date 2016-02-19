/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import Component from '../Component';
import cssClass from '../prop-types/cssClass';

/**
 * Create an anonymous container component that manages elements provided by the defined factory.
 *
 * @param {Factory} factory
 * @param {String} className
 * @returns {Container}
 */
export default function createContainer(factory, className) {
    return class extends Component {
        static defaultProps = {
            elementClassName: className
        };

        static propTypes = {
            elementClassName: cssClass.isRequired,
            factory: PropTypes.instanceOf(factory).isRequired
        };

        state = {
            children: []
        };

        /**
         * Bind a listener on the factory that updates the container.
         *
         * @param {Object} props
         */
        constructor(props) {
            super();

            props.factory.subscribe(children => {
                this.setState({
                    children
                });
            });
        }

        /**
         * Render the container and the children defined in the factory.
         *
         * @returns {ReactElement}
         */
        render() {
            let props = this.props,
                children = this.state.children;

            return (
                <div
                    className={this.formatClass(props.elementClassName, {
                        'has-children': (children.length > 0)
                    })}
                    {...this.inheritNativeProps(props)}>

                    {children}
                </div>
            );
        }
    };
}
