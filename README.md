## About

Logging can be a pain in the ass. This library simplifies things by overwriting standard logging functions.
This will work for the browser as well as in node.js

This module will override:
	`console.log('message');`
	`console.info('message');`
	`console.warn('message');`
	`console.error('message');`

## Usage
All you need to is is require it on top of the `server.js` or `app.js`

	require('console.logentries')();

If you also want it to forward the logs to logentries you can give a token:

	require('console.logentries')(logentriesToken);
	
By default this will **exclude** `console.log` messages. If you want to send those also to logentries you can add a second parameter.

	require('console.logentries')(logentriesToken, true);

The last paramater is the username if you want to include this.

	require('console.logentries')(logentriesToken, false, username);


## Extras

### NodeJs Error handling. [NODE.js]
This module will also catch unhandled errors and output a stacktrace (to console and logentries)

### Pretty Output [NODE.js]
This module creates pretty output in node.js console. Giving colors to logging types.

### [Application Parts] [NODE.js]
Everting that is betweent [] will be underlined in the output.

### Process Kill [NODE.js]
It will log if the process is being killed.