/**
 * Created by guntherclaes on 20/10/15.
 */

//Include Modules
var util = require('util'),
  winston = require('winston'),
  logger = new winston.Logger(),
  Logentries = require('le_node');

exports = module.exports = function (logentriesToken, sendDebug) {
  // Override the built-in console methods with winston hooks
  if(logentriesToken) {
    if(!sendDebug){
      logger.add(winston.transports.Logentries, { token: logentriesToken, level: 'info' });
    } else {
      logger.add(winston.transports.Logentries, { token: logentriesToken, level: 'debug' });
    }
  }
  logger.add(winston.transports.Console, {
    colorize: true,
    timestamp: true,
    level: 'debug'
  });

  function formatArgs(args){
    return [util.format.apply(util.format, Array.prototype.slice.call(args))];
  }

  console.log = function(){
    logger.debug.apply(logger, formatArgs(arguments));
  };
  console.info = function(){
    logger.info.apply(logger, formatArgs(arguments));
  };
  console.warn = function(){
    logger.warn.apply(logger, formatArgs(arguments));
  };
  console.error = function(){
    logger.error.apply(logger, formatArgs(arguments));
  };
  console.debug = function(){
    logger.debug.apply(logger, formatArgs(arguments));
  };
};

