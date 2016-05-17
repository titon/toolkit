/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { Children, PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import Component from '../../Component';
import { motionSpring } from '../../propTypes';
import MODULE from './module';

export default class FadeGroup extends Component {
    static module = MODULE;

    static defaultProps = {
        motion: {
            stiffness: 120,
            damping: 14
        },
        style: {}
    };

    static propTypes = {
        children: PropTypes.node.isRequired,
        motion: motionSpring,
        style: PropTypes.object
    };

    constructor(props) {
        super();

        this.state = {
            styles: []
        };

        this.handleWillEnter = this.handleWillEnter.bind(this);
        this.handleWillLeave = this.handleWillLeave.bind(this);
    }

    handleWillEnter() {
        return { opacity: 0 };
    }

    handleWillLeave() {
        return { opacity: spring(0, this.props.motion) };
    }

    mapStylesFromChildren(children) {
        let styles = [],
            defaultStyles = [];

        Children.toArray(children).map(child => {
            styles.push({
                key: child.key,
                style: { opacity: spring(1, this.props.motion) }
            });

            defaultStyles.push({
                key: child.key,
                style: { opacity: 0 }
            });
        });

        return {
            styles,
            defaultStyles
        };
    }

    render() {
        let { children, style } = this.props,
            items = Children.toArray(children);

        if (!items.length) {
            return null;
        }

        let { styles, defaultStyles } = this.mapStylesFromChildren(items);

        return (
            <TransitionMotion
                willEnter={this.handleWillEnter}
                willLeave={this.handleWillLeave}
                defaultStyles={defaultStyles}
                styles={styles}
            >
                {motionStyles => {
                    return (
                        <div className={this.formatChildClass('group')}>
                            {motionStyles.map((motionStyle, i) => {
                                return React.cloneElement(items[i], {
                                    style: {
                                        ...motionStyle.style,
                                        ...style
                                    }
                                });
                            })}
                        </div>
                    );
                }}
            </TransitionMotion>
        );
    }
}
