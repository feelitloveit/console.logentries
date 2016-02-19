/**
 * Created by guntherclaes on 20/10/15.
 */

//Include Modules
var clc = require("cli-color");
var Logger = require('le_node');

//Set settings
var settings = {
  mapping: {
    log: {
      color: clc.blackBright,
      leType: 'debug'
    },
    info: {
      color: clc.blue,
      leType: 'info'
    },
    warn: {
      color: clc.xterm(202),
      leType: 'warning'
    },
    error: {
      color: clc.red,
      leType: 'err'
    }
  }
};

exports = module.exports = function (logentriesToken, sendDebug) {

  //If logentries token set, load logentries logger
  if(logentriesToken) {
    var log = new Logger({token: logentriesToken});
  }

  //Based on mapping overide console functions
  Object.keys(settings.mapping).forEach(function (method) {

    var oldMethod = console[method].bind(console);

    console[method] = function (message) {

      //Underline application parts in strings; create json of objects.
      if(typeof message === 'string'){
        message2 = message.replace(/\[(.*)\]/, settings.mapping[method].color.underline('$1'));
      } else {
        message2 = JSON.stringify(message, null, '\t');
      }

      //Do console output
      oldMethod.apply(console,
        [clc.blackBright.inverse(new Date().toISOString())]
          .concat('-').concat(settings.mapping[method].color.bold(settings.mapping[method].leType))
          .concat('-').concat(settings.mapping[method].color(message2))
      );

      //Send to logentries
      if (log && (sendDebug || method !== 'log')) {
        log.log(settings.mapping[method].leType, settings.mapping[method].color(message)); // eslint-disable-line
      }

    };
  });

  //Catch exceptions
  process.on('uncaughtException', function (err) {
    console.error(err.stack.toString()); // eslint-disable-line
  });

  //Send message on process kill
  var killed = false;

  function kill (by) {
    if (! killed) {
      killed = true;
      process.stdout.write(clc.blackBright.inverse(new Date().toISOString())
        .concat(' - ').concat(settings.mapping['warn'].color.bold('warning'))
        .concat(' - ').concat(settings.mapping['warn'].color.bold('Server is shutting Down \n')));

      if (log) {
        log.log('warning', "Server is shutting Down (" + by + ')');
        log.once('connection drain', function () {
          process.exit(0)
        });
      } else {
        process.exit(0);
      }
      setTimeout(function () {
        process.exit(0);
      }, 3000)
    } else {
      process.exit(0);
    }
  }

  process.on('SIGHUP', () => kill('SIGHUP'));
  process.on('SIGINT', () => kill('SIGINT'));
  process.on('SIGQUIT', () => kill('SIGQUIT'));
  process.on('SIGABRT', () => kill('SIGABRT'));
  process.on('SIGTERM', () => kill('SIGTERM'));
  process.on('exit', () => kill('exit'));

};
