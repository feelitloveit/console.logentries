/**
 * Created by guntherclaes on 20/10/15.
 */

var q = require('q');
var CircularJSON = require('circular-json');

exports = module.exports = function (logentriesToken, sendDebug, user) {

  if(!user){
    user = '';
  }
  //If logentries token set, load logentries logger
  if(logentriesToken) {
    var log = require('../lib/le.js');
    log.init( { token: logentriesToken, catchall: true, trace: true, page_info: 'per-entry', print: false } );
  }

  //Based on mapping overide console functions
  ['warn', 'error', 'info', 'log'].forEach(function (method) {

    var oldMethod = console[method].bind(console);

    console[method] = function (...args) {
      
      if(args && args[0] === 'CONSOLE.LOGENTRIES_IGNORE') {
        return;
      }

      //Send to console
      oldMethod.apply(console, args);

      let message = '';
      for(let i = 0; i < args.length; i++) {
        let current = args[i];
        if (current && current.stack) {
          current = current.stack;
        } else if (typeof current !== 'string') {
          current = CircularJSON.stringify(current);
        }
        message = message + ' - ' + current;
      }

      //Send to logentries
      if (log && sendDebug && method === 'log') {
        const username = user instanceof Function ? user() : user;
        log.log(username + ' - ' + message); // eslint-disable-line
      }

      if (log && method === 'info') {
        const username = user instanceof Function ? user() : user;
        log.info(username + ' - ' + message); // eslint-disable-line
      }

      if (log && method === 'warn') {
        const username = user instanceof Function ? user() : user;
        log.warn(username + ' - ' + message); // eslint-disable-line
      }

      if (log && method === 'error') {
        const username = user instanceof Function ? user() : user;
        log.error(username + ' - ' + message); // eslint-disable-line
      }

    };
  });

};
