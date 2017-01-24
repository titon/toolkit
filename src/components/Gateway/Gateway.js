/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import React from 'react';
import Component from '../../Component';
import bind from '../../decorators/bind';
import invariant from '../../utility/invariant';
import CONTEXT_TYPES from './contextTypes';
import MODULE from './module';

let instantiated = false;

export default class Gateway extends Component {
  static module = MODULE;

  static childContextTypes = CONTEXT_TYPES;

  constructor() {
    super();

    invariant(!instantiated, 'Only one `Gateway` may exist.');
    instantiated = true;

    this.gates = {};
  }

  getChildContext() {
    return {
      [MODULE.contextKey]: {
        registerGate: this.registerGate,
        warpIn: this.warpIn,
        warpOut: this.warpOut,
      },
    };
  }

  hasGate(gate) {
    invariant(this.gates[gate], 'The `Gate` "%s" does not exist.', gate);

    return true;
  }

  @bind
  registerGate(gate, warpIn, warpOut) {
    invariant(!this.gates[gate],
      'A `Gate` with the name "%s" has already been created.', gate);

    invariant((typeof warpIn === 'function' && typeof warpOut === 'function'),
      'A `Gate` requires function handlers for warping in and out elements.');

    this.gates[gate] = { warpIn, warpOut };
  }

  @bind
  warpIn(gate, element) {
    if (this.hasGate(gate)) {
      this.gates[gate].warpIn(element);
    }
  }

  @bind
  warpOut(gate, element) {
    if (this.hasGate(gate)) {
      this.gates[gate].warpOut(element);
    }
  }

  render() {
    return (
      <div className={this.formatClass()}>
        {this.props.children}
      </div>
    );
  }
}
