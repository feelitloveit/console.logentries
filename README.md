# Node Error Logger

This module will override console.log, info, warn and error; And will output it formated.

All you need to is is require it on top of the `server.js`

	require('vsko-node-error-logger')();

If you also want it to forward the logs to logentries you can give a token:

	require('vsko-node-error-logger')(logentriesToken);
	
By default this will exclude debug messages. If you want to send those also to logentries you can add a second parameter.

	require('vsko-node-error-logger')(logentriesToken, true);

