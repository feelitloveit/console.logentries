/**
 * Created by ftilkin on 2/17/15.
 *
 * Angular module "RemoteErrorLogger"
 *
 * Can be used for server-side logging, and provides a browser stacktrace.
 */


LE = require('./../lib/le.min.js');


// http://www.bennadel.com/blog/2542-logging-client-side-errors-with-angularjs-and-stacktrace-js.htm

//The error log service is our wrapper around the core error
//handling ability of AngularJS. Notice that we pass off to
//the native "$log" method and then handle our additional
//server-side logging.

module.exports =  [ '$log', '$window', 'stackTraceService', 'settings', function errorLogServiceFactory( $log, $window, stackTraceService, settings ) {
  var that = {};

  LE.init( { token: settings.logging.logentriesToken, catchall: true, trace: true, page_info: 'per-page', print: true } ); //MY LOG TOKEN -> TODO should come from some settings file later on !!!

  var buildErrorMessage = function(exception) {
    var message = '';
    message += ' url: ' + $window.location.hash;
    message += '\n browser: ' + $window.navigator.userAgent;
    message += '\n message: ' + exception.message;
    message += '\n stackTrace: ' + exception.stack;
    return message;
  };
  var getUsername = function (callback) {
    $.ajax({
      type: "GET",
      url: settings.oauth.me,
      xhrFields: {withCredentials: true},
      success: function (data) {
        callback('\n user: ' + data.username);
      },
      error: function (data, status) {
        if(status === 403) {
          callback('\n user: <unauthenticated>');
        } else {
          callback('\n user: <could not connect with oauth>');
        }
      }
    });
  };

  that.log = function (message) {
    if(settings.logging.logentriesEnabled && (settings.logging.level === 'LOG')) {
      getUsername(function (username) {
        LE.log(username + '\n' +message);
      });
    }
  };

  that.info = function (message) {
    if(settings.logging.logentriesEnabled && (settings.logging.level === 'INFO' || settings.logging.level === 'LOG')) {
      getUsername(function (username) {
        LE.info(username + '\n' +message);
      });
    }
  };

  that.warn = function (message) {
    if(settings.logging.logentriesEnabled && (settings.logging.level === 'WARN' || settings.logging.level === 'INFO' || settings.logging.level === 'LOG')) {
      getUsername(function (username) {
        LE.warn(username + '\n' +message);
      });
    }
  };

  that.error = function (message) {
    if(settings.logging.logentriesEnabled) {
      getUsername(function (username) {
        LE.error(username + '\n' +message);
      });
    }
  };

  that.logException = function (exception) {
    that.error(buildErrorMessage(exception));
  };

  return that;


      /*// I log the given error to the remote server.
      function log( exception, cause ) {

        // Pass off the error to the default error handler on the AngualrJS logger. This will output the
        // error to the console (and let the application keep running normally for the user).
        $log.error.apply( $log, arguments );

        // Now, we need to try and log the error the server.
        // --
        // NOTE: In production, I have some debouncinglogic here to prevent the same client from
        // logging the same error over and over again! All that would do is add noise to the log.
        try {

          var errorMessage = exception.toString();
          console.log( "[errorlogservice] Trying to log the following error remotely: " + exception );

          LE.log( exception );

          var stackTrace = stackTraceService.print( { e: exception } );
          console.log( "STACKTRACE: " + stackTrace );
//					LE.log( stackTrace );

          //This is from the examples from stacktrace.js at github, but it doesn't seem to work ('StackTrace not defined')...
//					var callback = function(stackframes) {
//						var stringifiedStack = stackframes.map(function(sf) {
//							sf.toString();
//						}).join('\n');
//						console.log(stringifiedStack);
//					};
//					var errback = function(err) { console.log(err.message); };
//
//					StackTrace.fromError( exception ).then( callback, errback );



          // Log the JavaScript error to the server.
          // --
          // NOTE: In this demo, the POST URL doesn't exists and will simply return a 404.
          // $.ajax( {
          // 	type: "POST",
          // 	url: "./javascript-errors",
          // 	contentType: "application/json",
          // 	data: angular.toJson( {
          // 		errorUrl: $window.location.href,
          // 		errorMessage: errorMessage,
          // 		stackTrace: stackTrace,
          // 		cause: ( cause || "" )
          // 	} )
          // } );
        } catch ( loggingError ) {
          // For Developers - log the log-failure.
          $log.warn( "Error logging failed" );
          $log.log( loggingError );
        }

      }

      // Return the logging function.
      return( log );*/
    } ]
;
