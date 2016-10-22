/**
 * @copyright   2010-2016, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React, { PropTypes } from 'react';
import { TransitionMotion, spring } from 'react-motion';
import Component from '../../Component';
import { axisPositions } from '../../propTypes';

export default class SlideIn extends Component {
  static propTypes = {
    direction: axisPositions.isRequired,
  };

  handleOnLeave() {

  }

  render() {
    return (
      <TransitionMotion
        willLeave={this.handleOnLeave}
      />
        );
  }
}
