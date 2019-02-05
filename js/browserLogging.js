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
    var log = require('./../lib/le.min.js');
    log.init( { token: logentriesToken, catchall: true, trace: true, page_info: 'per-entry', print: false } );
  }

  //Based on mapping overide console functions
  ['warn', 'error', 'info', 'log'].forEach(function (method) {

    var oldMethod = console[method].bind(console);

    console[method] = function () {

      //Send to console
      oldMethod.apply(console, arguments);

      const message = [...arguments].reduce( (acc, current) => {
        if (typeof current !== 'undefined'&& typeof current.stack !== 'undefined') {
          current = current.stack;
        } else if (typeof current !== 'string') {
          current = CircularJSON.stringify(current);
        }
        return acc + ' ' + current;
      }, '');

      //Send to logentries
      if (log && sendDebug && method === 'log') {
        log.log(user + ' - ' + message); // eslint-disable-line
      }

      if (log && method === 'info') {
        log.info(user + ' - ' + message); // eslint-disable-line
      }

      if (log && method === 'warn') {
        log.warn(user + ' - ' + message); // eslint-disable-line
      }

      if (log && method === 'error') {
        log.error(user + ' - ' + message); // eslint-disable-line
      }

    };
  });

};
