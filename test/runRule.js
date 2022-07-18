'use strict';
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
require('dotenv').config();

global.done = () => console.log('done called');

const { readFileSync } = require('fs');
const evrythng = require('evrythng');

const { TRUSTED_APPLICATION_KEY, API_URL } = process.env;
const actionFile = './action.json';
import * as reactor from '../main.js';

evrythng.setup({
  apiUrl: `${API_URL}`,
});

global.app = new evrythng.TrustedApplication(TRUSTED_APPLICATION_KEY);
global.logger = {
  info: msg => console.log(msg),
  error: msg => console.log(msg),
};

/**
 * The main function.
 */
const main = async () => {
  try {
    const action = JSON.parse(readFileSync(actionFile, 'utf8'));
    await reactor.onActionCreated({action: action});
  } catch (e) {
    console.log(e);
  }
};

main();