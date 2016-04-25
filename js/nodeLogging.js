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
      if (settings.mapping[method] && log && (sendDebug || method !== 'log')) {
        try{
          if(typeof message == 'object'){
            log.log(settings.mapping[method].leType, JSON.stringify(message)); // eslint-disable-line
          }else{
            log.log(settings.mapping[method].leType, message); // eslint-disable-line
          }
        }catch(e){

        }
      }

    };
  });

  //Catch exceptions
  process.on('uncaughtException', function (err) {
    console.error(err.stack.toString()); // eslint-disable-line
  });

};
