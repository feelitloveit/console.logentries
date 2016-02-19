/**
 * Created by guntherclaes on 19/02/16.
 */
module.exports = false;

// Only Node.JS has a process variable that is of [[Class]] process
try {
  module.exports = 'object' === typeof process && Object.prototype.toString.call(process) === '[object process]'
} catch(e) {}
