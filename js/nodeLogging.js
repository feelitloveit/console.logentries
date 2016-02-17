/**
 * Created by guntherclaes on 20/10/15.
 */

exports = module.exports = function (logentriesToken, sendDebug) {
  var clc = require("cli-color");
  var Logger = require('le_node');

  if(logentriesToken) {
    var log = new Logger({token: logentriesToken});
  }

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

      if(typeof message === 'string'){
        message2 = message.replace(/\[(.*)\]/, colorMapping[method].underline('$1'));
      } else {
        message2 = JSON.stringify(message, null, '\t');
      }

      oldMethod.apply(console,
        [clc.blackBright.inverse(new Date().toISOString())]
          .concat('-').concat(colorMapping[method].bold(typeMapping[method]))
          .concat('-').concat(colorMapping[method](message2))
      );

      if (log && (sendDebug || method !== 'log')) {

        log.log(typeMapping[method], colorMapping[method](message)); // eslint-disable-line

      }

    };
  });

  process.on('uncaughtException', function (err) {
    console.error(err.stack.toString()); // eslint-disable-line
  });

  var killed = false;
  function kill(by){
    if(!killed){
      killed = true;
      process.stdout.write(clc.xterm(202).bold('**** Server is shutting Down ****  \n'));
      if (log) {
        log.log('warning', "Server is shutting Down (" + by + ')');
        log.once('connection drain', function () {
          process.exit(0)
        });
      }else{
        process.exit(0);
      }
      setTimeout(function(){
        process.exit(0);
      }, 3000)
    }else{
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
