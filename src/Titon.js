/**
 * @copyright   2010-2017, The Titon Project
 * @license     http://opensource.org/licenses/BSD-3-Clause
 * @link        http://titon.io
 * @flow
 */

import { Adapter } from 'aesthetic';
import { aesthetic } from './styler';
import flags from './flags';

type FlagsMap = { [flag: string]: boolean };
type Logger = (message: string | Error, ...args: string[]) => void;
type Options = {
  cookiePrefix: string,
  debug: boolean,
};

export class TitonToolkit {
  build: string = '%build%';
  flags: FlagsMap = flags;
  logger: ?Logger = null;
  options: Options = {
    cookiePrefix: 'titon.',
    debug: false,
  };
  version: string = '%version%';

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
    if (process.env.NODE_ENV !== 'production') {
      if (typeof logger !== 'function') {
        throw new TypeError('Logger must be a function.');
      }
    }

    this.logger = logger;

    return this;
  }
}

export default new TitonToolkit();
