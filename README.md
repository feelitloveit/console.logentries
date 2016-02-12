# Node Error Logger

This module will override console.log, info, warn and error; And will output it formated.

All you need to is is require it on top of the `server.js`

	require('vsko-node-error-logger')

If you also want it to forward the logs to logentries you can give a token:

	require('vsko-node-error-logger')(logentriesToken);
	
	
