/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import { TransitionMotion } from 'react-motion';
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
