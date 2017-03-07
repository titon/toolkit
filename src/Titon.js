/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import { Adapter } from 'aesthetic';
import flags from './flags';
import { aesthetic } from './styler';

type FlagsMap = { [flag: string]: boolean };
type Logger = (message: string | Error, ...args: string[]) => void;
type OptionsMap = { [option: string]: boolean | string };

export class TitonToolkit {
  version: string = '%version%';
  build: string = '%build%';
  logger: ?Logger = null;
  options: OptionsMap = {
    cookiePrefix: 'titon.',
    debug: false,
  };

  static flags: FlagsMap = flags;

  debug(): this {
    this.options.debug = true;

    return this;
  }

  log(message: string | Error, ...args: string[]): this {
    if (this.logger) {
      this.logger(message, ...args);
    }

    return this;
  }

  setAdapter(adapter: Adapter): this {
    aesthetic.setAdapter(adapter);

    return this;
  }

  setLogger(logger: Logger): this {
    if (typeof logger !== 'function') {
      throw new TypeError('Logger must be a function.');
    }

    this.logger = logger;

    return this;
  }
}

export default new TitonToolkit();
