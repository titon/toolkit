/* eslint no-console: 0 */

import suppressConsole, { suppressedLogs } from '../../src/decorators/suppressConsole';

class SuppressConsoleStub {
  @suppressConsole
  log() {
    console.log('log');
  }

  info() {
    console.info('Testing suppressConsole() decorator. You can ignore me!');
  }

  @suppressConsole
  warnError() {
    console.warn('warn');
    console.error('error');
  }

  @suppressConsole
  dir() {
    console.dir('dir');
  }
}

describe('decorators/suppressConsole()', () => {
  it('should suppress and log all console messages', () => {
    const obj = new SuppressConsoleStub();

    obj.log();
    obj.info();
    obj.warnError();
    obj.dir();

    expect(suppressedLogs).toEqual([
      { type: 'log', args: ['log'] },
      { type: 'warn', args: ['warn'] },
      { type: 'error', args: ['error'] },
      { type: 'dir', args: ['dir'] },
    ]);
  });
});
