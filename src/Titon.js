/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 */

import flags from './flags';

class Titon {
  constructor() {
    this.version = '%version%';
    this.build = '%build%';
    this.logger = null;
    this.options = {
      cookiePrefix: 'titon.',
      debug: false,
      elementSeparator: '__',
      modifierSeparator: '--',
      namespace: '',
      states: ['info', 'debug', 'warning', 'error', 'success'],
    };
  }

  debug() {
    this.options.debug = true;

    return this;
  }

  log(message, ...args) {
    if (this.logger) {
      this.logger(message, args);
    }

    return this;
  }

  setLogger(logger) {
    if (typeof logger !== 'function') {
      throw new TypeError('Logger must be a function.');
    }

    this.logger = logger;

    return this;
  }

  setStyleFormat(namespace, elementSeparator = '__', modifierSeparator = '--') {
    this.options.namespace = namespace || '';
    this.options.elementSeparator = elementSeparator;
    this.options.modifierSeparator = modifierSeparator;

    return this;
  }
}

Titon.flags = flags;

export default new Titon();
