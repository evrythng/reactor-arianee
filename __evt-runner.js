import EVT from 'evrythng';

import * as reactor from './main.js';

export const handler = (event, context) => {

  try {
    EVT.setup({
      apiUrl: event.apiUrl,
      interceptors: [{
        request: function (options) {
          options.headers['X-Evrythng-Reactor'] = event.reactorHeader;
          return options;
        }
      }]
    });

    var app = new EVT.TrustedApplication(event.apiKey);

    var operator = null;
    if (event.isOperator) {
      operator = new EVT.Operator(event.operatorApiKey);
    }

    var logs = [];

    var done = function () {
      if (logs.length > 0) {

      } else {
        context.succeed();
      }
    };

    function getLogMsg(level, msg) {
      return {
        timestamp: Date.now(),
        logLevel: level,
        message: String(msg)
      }
    }

    function getLogger(level) {
      return function (msg) {
        logs.push(getLogMsg(level, msg));
      }
    }

    var logger = {
      debug: getLogger('debug'),
      info: getLogger('info'),
      warn: getLogger('warn'),
      error: getLogger('error')
    };

    global.EVT = EVT;
    global.app = app;
    global.isOperator = event.isOperator;
    global.operator = operator;
    global.done = done;
    global.logger = logger;

    try {
      if (reactor[event.function]) {
        reactor[event.function](event.event);
      }
    } catch (e) {
      console.log(e);
    }
  } catch (e) {
    console.log(e);
  }
};