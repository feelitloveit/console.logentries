// The "stacktrace" library is loaded using require;
// but, we don't want to reference
// global objects inside the AngularJS components - that's
// not how AngularJS rolls; as such, we want to wrap the
// stacktrace feature in a proper AngularJS service that
// formally exposes the print method.

var printStackTrace = require('./../lib/stacktrace.js');

module.exports =
  [ function stackTraceServiceFactory() {
    'use strict';
    // "printStackTrace" is a global object (see below -> inlined stacktrace.js library).
    return ({
      print: printStackTrace
    });
  } ]
;
