/**
 * Created by guntherclaes on 20/10/15.
 */

exports = module.exports = function (logentriesToken) {
  var clc = require("cli-color");
  var Logger = require('le_node');

  var log = new Logger({token: logentriesToken});

  var colorMapping = {
    log: clc.blackBright,
    info: clc.blue,
    warn: clc.xterm(202),
    error: clc.red
  };

  var typeMapping = {
    log: 'debug',
    info: 'info',
    warn: 'warning',
    error: 'err'
  };

  ["log", "info", "warn", "error"].forEach(function (method) {
    var oldMethod = console[method].bind(console);
    console[method] = function (message) {
      var message1 = (message.match(/\[(.*)\]/)||[])[1];
      var message2 = message.replace(/\[(.*)\]/, '');

      oldMethod.apply(console,
        [clc.blackBright.inverse(new Date().toISOString())]
          .concat('-').concat(colorMapping[method].bold(typeMapping[method]))
          .concat('-').concat(colorMapping[method](clc.underline.bold(message1)+ message2))
      );

      if (logentriesToken && method !== 'log') {

        log.log(typeMapping[method], colorMapping[method](message)); // eslint-disable-line

      }

    };
  });

  process.on('uncaughtException', function (err) {
    console.error(err.stack.toString()); // eslint-disable-line
  });
}