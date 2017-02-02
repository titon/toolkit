/* eslint-disable global-require */

import { configure } from '@kadira/storybook';

function loadStories() {
  require('./motions/Collapse.js');
}

configure(loadStories, module);
